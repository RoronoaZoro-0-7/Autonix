import prisma from '../config/db';
import { TriggerType } from '@prisma/client';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { cacheWorkflow, invalidateWorkflowCache, getCachedWorkflow } from '../utils/helpers';
import { AppError } from '../utils/AppError';

export const createWorkflow = async (
    orgId: string,
    userId: string,
    data: {
        name: string;
        description?: string;
        triggerType: TriggerType;
        cronExpression?: string;
        graph: {
            nodes: any[]; edges: any[];
        }
    }
) => {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
        throw new AppError('Organization not found', 404);
    }
    const workflowCount = await prisma.workflow.count({
        where: { orgId, isDeleted: false }
    });
    const limits: Record<string, number> = {
        FREE: 10,
        PRO: 50,
        ENTERPRISE: Infinity
    };

    if (workflowCount >= limits[org.plan]) {
        throw new AppError(`Workflow limit reached for ${org.plan} plan. Please upgrade.`, 403);
    }
    if (data.triggerType === TriggerType.SCHEDULE && !data.cronExpression) {
        throw new AppError('Cron expression is required for SCHEDULE trigger type', 400);
    }
    let webhookUrl = null;
    let webhookSecret = null;

    if (data.triggerType === TriggerType.WEBHOOK) {
        const webhookId = uuidv4();
        webhookUrl = `${process.env.BACKEND_URL}/api/webhooks/${webhookId}`;
        webhookSecret = crypto.randomBytes(32).toString('hex');
    }


    // 5 — save to DB
    const workflow = await prisma.workflow.create({
        data: {
            orgId,
            createdById: userId,
            name: data.name,
            description: data.description,
            triggerType: data.triggerType,
            cronExpression: data.cronExpression || null,
            webhookUrl,
            webhookSecret,
            graph: data.graph,
            version: 1,
            isActive: false  // always starts disabled — user must manually enable
        }
    });

    // 6 — save version 1 snapshot
    await prisma.workflowVersion.create({
        data: {
            workflowId: workflow.id,
            version: 1,
            graph: data.graph,
            savedById: userId
        }
    });

    // 7 — cache it in Redis for worker to read later
    await cacheWorkflow(orgId, workflow.id, workflow);

    return workflow;

}

export const getWorkflows = async (orgId: string) => {
    const workflows = await prisma.workflow.findMany({
        where: {
            orgId,
            isDeleted: false  // never show soft deleted workflows
        },
        include: {
            _count: {
                select: { executions: true }  // total execution count
            },
            executions: {
                orderBy: { startedAt: 'desc' },
                take: 1,  // only get the most recent execution
                select: {
                    status: true,
                    startedAt: true,
                    durationMs: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // shape the response cleanly
    return workflows.map(w => ({
        id: w.id,
        name: w.name,
        description: w.description,
        triggerType: w.triggerType,
        isActive: w.isActive,
        version: w.version,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
        totalExecutions: w._count.executions,
        lastExecution: w.executions[0] || null  // null if never run
    }));
};

export const getWorkflow = async (orgId: string, workflowId: string) => {

    const cached = await getCachedWorkflow(orgId, workflowId);
    if (cached) {
        return cached;
    }

    const workflow = await prisma.workflow.findFirst({
        where: {
            id: workflowId,
            orgId,
            isDeleted: false  // never show soft deleted workflows
        }
    });
    if (!workflow) {
        throw new AppError('Workflow not found', 404);
    }

    await cacheWorkflow(orgId, workflow.id, workflow);
    return workflow;
}

export const updateWorkflow = async (
    orgId: string,
    workflowId: string,
    userId: string,
    data: {
        name?: string;
        description?: string;
        cronExpression?: string;
        graph?: {
            nodes: any[]; edges: any[];
        }

    }) => {
    const workflow = await prisma.workflow.findFirst({
        where: {
            id: workflowId,
            orgId,
            isDeleted: false
        }
    });
    if (!workflow) {
        throw new AppError('Workflow not found', 404);
    }

    // If graph itself is getting changed then create
    // old version of it and save it
    let newVersion = workflow.version;
    if (data.graph) {
        newVersion = workflow.version + 1;
        await prisma.workflowVersion.create({
            data: {
                workflowId: workflow.id,
                version: newVersion,
                graph: data.graph,
                savedById: userId
            }
        });
    }
    const updated = await prisma.workflow.update({
        where: { id: workflow.id },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.cronExpression && { cronExpression: data.cronExpression }),
            ...(data.graph && { graph: data.graph, version: newVersion }),
        }
    })
    // once study about this cache stampede
    await invalidateWorkflowCache(orgId, workflow.id);
    return updated;
}

export const deleteWorkflow = async (orgId: string, workflowId: string) => {
    const workflow = await prisma.workflow.findFirst({
        where: {
            id: workflowId,
            orgId,
            isDeleted: false
        }
    });
    if (!workflow) {
        throw new AppError('Workflow not found', 404);
    }
    await prisma.workflow.update({
        where: { id: workflow.id },
        data: {
            isDeleted: true,
            isActive: false
        }
    });
    await invalidateWorkflowCache(orgId, workflowId);
    return { message: 'Workflow deleted successfully' };
}

export const toggleWorkflow = async (orgId: string, workflowId: string) => {
    // 1 — find workflow
    const workflow = await prisma.workflow.findFirst({
        where: { id: workflowId, orgId, isDeleted: false }
    });
    if (!workflow) throw new AppError('Workflow not found', 404);

    // 2 — if trying to ENABLE, validate graph first
    if (!workflow.isActive) {
        const graph = workflow.graph as { nodes: any[]; edges: any[] };

        if (!graph.nodes || graph.nodes.length === 0) {
            throw new AppError('Cannot enable workflow with no nodes', 400);
        }

        // must have at least one trigger node
        const hasTrigger = graph.nodes.some((n: any) =>
            ['webhook', 'schedule', 'manual'].includes(n.type)
        );
        if (!hasTrigger) {
            throw new AppError('Workflow must have at least one trigger node', 400);
        }

        // must have at least one action node (not just a trigger)
        const hasAction = graph.nodes.some((n: any) =>
            !['webhook', 'schedule', 'manual'].includes(n.type)
        );
        if (!hasAction) {
            throw new AppError('Workflow must have at least one action node', 400);
        }
    }

    // 3 — toggle
    const updated = await prisma.workflow.update({
        where: { id: workflowId },
        data: { isActive: !workflow.isActive }
    });

    // 4 — invalidate cache
    await invalidateWorkflowCache(orgId, workflowId);

    return {
        message: updated.isActive ? 'Workflow enabled' : 'Workflow disabled',
        isActive: updated.isActive
    };
};

export const getWorkflowVersions = async (orgId: string, workflowId: string) => {
    const workflow = await prisma.workflow.findFirst({
        where: { id: workflowId, orgId, isDeleted: false }
    });
    if (!workflow) {
        throw new AppError('Workflow not found', 404);
    }
    const versions = await prisma.workflowVersion.findMany({
        where: { workflowId },
        include: {
            savedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: { version: 'desc' }
    });
    return versions;
}

export const restoreVersion = async (orgId: string, workflowId: string, versionNumber: number, userId: string) => {
    // 1 — verify workflow exists
    const workflow = await prisma.workflow.findFirst({
        where: { id: workflowId, orgId, isDeleted: false }
    });
    if (!workflow) throw new AppError('Workflow not found', 404);

    // 2 — find the version to restore
    const targetVersion = await prisma.workflowVersion.findUnique({
        where: { workflowId_version: { workflowId, version: versionNumber } }
    });
    if (!targetVersion) throw new AppError(`Version ${versionNumber} not found`, 404);

    // 3 — save current state as new version before overwriting
    const newVersion = workflow.version + 1;

    await prisma.workflowVersion.create({
        data: {
            workflowId,
            version: newVersion,
            graph: workflow.graph as any,
            savedById: userId
        }
    });

    // 4 — restore old graph as current workflow
    const updated = await prisma.workflow.update({
        where: { id: workflowId },
        data: {
            graph: targetVersion.graph as any,
            version: newVersion,
            isActive: false  // disable after restore — user must re-enable manually
        }
    });

    // 5 — invalidate cache
    await invalidateWorkflowCache(orgId, workflowId);

    return {
        message: `Restored to version ${versionNumber}`,
        currentVersion: newVersion,
        workflow: updated
    };
}