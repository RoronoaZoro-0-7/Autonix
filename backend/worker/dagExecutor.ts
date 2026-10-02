import { ExecutionStatus, NodeStatus } from '@prisma/client';
import prisma from '../config/db';
// import { ExecutionStatus, NodeStatus } from '@prisma/client';
import { WorkflowData } from '../queues/workflowQueue';
import { getCachedWorkflow } from '../utils/helpers';
import { executeWebhookNode } from './nodes/webhookNode';
import { executeHttpNode } from './nodes/httpNode';
import { executeGroqNode } from './nodes/groqNode';
import { executeSlackNode } from './nodes/slackNode';
import { executeGmailNode } from './nodes/gmailNode';
import { executeConditionalNode } from './nodes/conditionalNode';
import { executeMcpNode } from './nodes/mcpNode';

interface GraphNode {
    id: string;
    type: string;
    name?: string;
    config: Record<string, any>;
}

interface GraphEdge {
    from: string;
    to: string;
    label?: string;
}

interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

const NODE_HANDLERS: Record<string, Function> = {
    webhook: executeWebhookNode,
    http: executeHttpNode,
    groq: executeGroqNode,
    slack: executeSlackNode,
    gmail: executeGmailNode,
    conditional: executeConditionalNode,
    mcp: executeMcpNode,
};

const getExecutionOrder = (graph: Graph): string[] => {
    const inDegree: Record<string, number> = {};
    const adjacency: Record<string, string[]> = {};

    // Initializing the nodes
    for (const node of graph.nodes) {
        inDegree[node.id] = 0;
        adjacency[node.id] = [];
    }

    // count incoming edges per node
    for (const edge of graph.edges) {
        inDegree[edge.to]++;
        adjacency[edge.from].push(edge.to);
    }
    const queue: string[] = [];
    for (const nodeId in inDegree) {
        if (inDegree[nodeId] === 0) {
            queue.push(nodeId);
        }
    }

    const order: string[] = [];
    while (queue.length > 0) {
        // const current = queue.shift();
        // if(current === undefined){
        //     break;
        // }
        const current = queue.shift()!;
        // generally we avoid using non-null assertion 
        // operator, but here we are sure that queue 
        // is not empty due to the while condition
        order.push(current);
        for (const neighbor of adjacency[current]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    return order;
}

const getNextNodes = (
    currentNodeId: string,
    edges: GraphEdge[],
    conditionalResult?: boolean
): string[] => {
    const outgoing = edges.filter(e => e.from === currentNodeId);

    // if no labels on edges, normal node 
    if (!outgoing.some(e => e.label)) {
        return outgoing.map(e => e.to);
    }

    // if some conditional edges like true/false, 
    // then need to filter them as per condition
    return outgoing
        .filter(e => e.label === conditionalResult)
        .map(e => e.to);
}

export const executeWorkflow = async (job: WorkflowData) => {
    const { workflowId, executionId, orgId, triggerData } = job;

    // 1 — get workflow from cache or DB
    let workflow = await getCachedWorkflow(orgId, workflowId);
    if (!workflow) {
        workflow = await prisma.workflow.findFirst({
            where: { id: workflowId, orgId, isDeleted: false }
        });
    }
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);

    const graph = workflow.graph as Graph;

    // 2 — get execution order
    const executionOrder = getExecutionOrder(graph);

    // 3 — mark execution as RUNNING
    await prisma.execution.update({
        where: { id: executionId },
        data: { status: ExecutionStatus.RUNNING }
    });

    // 4 — track which nodes to skip (conditional paths not taken)
    const skippedNodes = new Set<string>();

    // 5 — track output of each node to pass to next
    const nodeOutputs: Record<string, any> = {
        trigger: triggerData  // first node gets trigger data as input
    };

    const startTime = Date.now();

    // 6 — execute nodes in order
    for (const nodeId of executionOrder) {
        const node = graph.nodes.find(n => n.id === nodeId)!;

        // skip nodes on the wrong conditional path
        if (skippedNodes.has(nodeId)) {
            await prisma.nodeLog.updateMany({
                where: { executionId, nodeId },
                data: { status: NodeStatus.SKIPPED }
            });
            continue;
        }

        // find input — output of the node that points to this one
        const incomingEdge = graph.edges.find(e => e.to === nodeId);
        const input = incomingEdge
            ? nodeOutputs[incomingEdge.from]
            : triggerData;

        // create node log
        const nodeLog = await prisma.nodeLog.create({
            data: {
                executionId,
                nodeId,
                nodeType: node.type,
                nodeName: node.name,
                status: NodeStatus.RUNNING,
                input
            }
        });

        const nodeStart = Date.now();

        try {
            // get handler for this node type
            const handler = NODE_HANDLERS[node.type];
            if (!handler) throw new Error(`Unknown node type: ${node.type}`);

            // execute the node
            const output = await handler(node.config, input);

            // save output
            nodeOutputs[nodeId] = output;

            // update node log — success
            await prisma.nodeLog.update({
                where: { id: nodeLog.id },
                data: {
                    status: NodeStatus.SUCCESS,
                    output,
                    completedAt: new Date(),
                    durationMs: Date.now() - nodeStart
                }
            });

            // handle conditional node — skip the path not taken
            if (node.type === 'conditional') {
                const nextNodes = getNextNodes(nodeId, graph.edges, output.result);
                const allNext = graph.edges
                    .filter(e => e.from === nodeId)
                    .map(e => e.to);
                const skipped = allNext.filter(
                    n => !nextNodes.includes(n)
                );
                skipped.forEach(n => skippedNodes.add(n));
            }

        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Unknown error';

            // update node log — failed
            await prisma.nodeLog.update({
                where: { id: nodeLog.id },
                data: {
                    status: NodeStatus.FAILED,
                    error: errorMessage,
                    completedAt: new Date(),
                    durationMs: Date.now() - nodeStart
                }
            });

            // mark entire execution as failed
            await prisma.execution.update({
                where: { id: executionId },
                data: {
                    status: ExecutionStatus.FAILED,
                    completedAt: new Date(),
                    durationMs: Date.now() - startTime,
                    error: `Node ${node.name || nodeId} failed: ${errorMessage}`
                }
            });

            // rethrow so BullMQ knows the job failed and can retry
            throw error;
        }
    }

    // 7 — all nodes succeeded
    const totalDuration = Date.now() - startTime;

    await prisma.execution.update({
        where: { id: executionId },
        data: {
            status: ExecutionStatus.SUCCESS,
            completedAt: new Date(),
            durationMs: totalDuration
        }
    });

    // 8 — update analytics (denormalized stats table)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.executionStat.upsert({
        where: { orgId_date: { orgId, date: today } },
        create: {
            orgId,
            date: today,
            totalExecutions: 1,
            successCount: 1,
            failureCount: 0,
            avgDurationMs: totalDuration
        },
        update: {
            totalExecutions: { increment: 1 },
            successCount: { increment: 1 },
            avgDurationMs: totalDuration  // simplified — proper avg needs more math
        }
    });

    return { success: true, durationMs: totalDuration };
};