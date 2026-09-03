import prisma from '../config/db';
// import { ExecutionStatus, NodeStatus } from '@prisma/client';
// import { WorkflowJobData } from '../queues/workflow.queue';
// import { getCachedWorkflow } from '../utils/helpers';
// import { executeWebhookNode } from './nodes/webhook.node';
// import { executeHttpNode } from './nodes/http.node';
// import { executeGroqNode } from './nodes/groq.node';
// import { executeSlackNode } from './nodes/slack.node';
// import { executeGmailNode } from './nodes/gmail.node';
// import { executeConditionalNode } from './nodes/conditional.node';
// import { executeMcpNode } from './nodes/mcp.node';

interface GraphNode{
    id:string;
    type:string;
    name?:string;
    config:Record<string,any>;
}

interface GraphEdge{
    from:string;
    to:string;
    label?:string;
}

interface Graph{
    nodes:GraphNode[];
    edges:GraphEdge[];
}

const NODE_HANDLERS: Record<string, Function> = {
  webhook: async (config: any, input: any) => ({ ...input }),
  http: async (config: any, input: any) => ({ ...input }),
  groq: async (config: any, input: any) => ({ ...input }),
  slack: async (config: any, input: any) => ({ ...input }),
  gmail: async (config: any, input: any) => ({ ...input }),
  conditional: async (config: any, input: any) => ({ result: true }),
  mcp: async (config: any, input: any) => ({ ...input }),
};