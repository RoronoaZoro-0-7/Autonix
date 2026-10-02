import { Request, Response } from 'express';
import { tryCatch } from '../utils/TryCatch';
import {
    triggerManualExecution,
    triggerWebhookExecution,
    getExecutions,
    getExecution
} from '../services/executionService';

export const triggerManualController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;

    if (!orgId || !workflowId) {
        return res.status(400).json({ success: false, message: 'Org ID and Workflow ID are required' });
    }

    const result = await triggerManualExecution(orgId, workflowId, req.user!.userId);
    res.status(200).json({ success: true, data: result });
});

export const triggerWebhookController = tryCatch(async (req: Request, res: Response) => {
    const { webhookId } = req.params;

    const webhookUrl = `${process.env.BACKEND_URL}/api/webhooks/${webhookId}`;
    const signature = req.headers['x-hub-signature-256'] as string | undefined;

    const result = await triggerWebhookExecution(webhookUrl, signature, {
        headers: req.headers,
        body: req.body,
        query: req.query
    });

    res.status(200).json({ success: true, data: result });
});

export const getExecutionsController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;

    if (!orgId || !workflowId) {
        return res.status(400).json({ success: false, message: 'Org ID and Workflow ID are required' });
    }

    const result = await getExecutions(orgId, workflowId);
    res.status(200).json({ success: true, data: result });
});

export const getExecutionController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;
    const executionId = req.params.executionId as string;

    if (!orgId || !workflowId || !executionId) {
        return res.status(400).json({ success: false, message: 'Org ID, Workflow ID and Execution ID are required' });
    }

    const result = await getExecution(orgId, workflowId, executionId);
    res.status(200).json({ success: true, data: result });
});