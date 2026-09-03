import { Request, Response } from 'express';
import { tryCatch } from '../utils/TryCatch';
import {
    createWorkflow,
    getWorkflows,
    getWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflow,
    getWorkflowVersions,
    restoreVersion
} from '../services/workflowService';
import { TriggerType } from '@prisma/client';

export const createWorkflowController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    if (!orgId) {
        return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    const { name, description, triggerType, cronExpression, graph } = req.body;
    if (!name || !triggerType || !graph) {
        return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const result = await createWorkflow(orgId, req.user!.userId, {
        name,
        description,
        triggerType: triggerType as TriggerType,
        cronExpression,
        graph
    });

    res.status(201).json({ success: true, data: result });
});

export const getWorkflowsController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    if (!orgId) {
        return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    const result = await getWorkflows(orgId);

    res.status(200).json({ success: true, data: result });
});

export const getWorkflowController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;

    if (!orgId || !workflowId) {
        return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    const result = await getWorkflow(orgId, workflowId);

    res.status(200).json({ success: true, data: result });
});

export const updateWorkflowController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;
    if (!orgId || !workflowId) {
        return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }


    const { name, description, cronExpression, graph } = req.body;
    if (!name && !description && !cronExpression && !graph) {
        return res.status(400).json({ success: false, message: 'At least one field is required' });
    }

    const result = await updateWorkflow(orgId, workflowId, req.user!.userId, {
        name,
        description,
        cronExpression,
        graph
    });
    res.status(200).json({ success: true, data: result });
});

export const deleteWorkflowController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;

    if (!orgId || !workflowId) {
        return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    const result = await deleteWorkflow(orgId, workflowId);

    res.status(200).json({ success: true, data: result });
});

export const toggleWorkflowController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;
    if (!orgId || !workflowId) {
        return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    const result = await toggleWorkflow(orgId, workflowId);
    res.status(200).json({ success: true, data: result });
});

export const getWorkflowVersionsController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;
    if (!orgId || !workflowId) {
        return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    const result = await getWorkflowVersions(orgId, workflowId);
    res.status(200).json({ success: true, data: result });
});

export const restoreVersionController = tryCatch(async (req: Request, res: Response) => {
    const orgId = req.params.orgId as string;
    const workflowId = req.params.workflowId as string;
    if (!orgId || !workflowId) {
        return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    const { version } = req.body;

    if (!version) {
        return res.status(400).json({ success: false, message: 'Version is required' });
    }

    if (isNaN(Number(version))) {
        return res.status(400).json({ success: false, message: 'Version must be a number' });
    }

    const result = await restoreVersion(orgId, workflowId, Number(version), req.user!.userId);
    res.status(200).json({ success: true, data: result });
});