import { Router } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import isAuth from '../middlewares/isAuth';
import { validate } from '../middlewares/validator_middleware';
import { checkOrgMember, checkOrgRole } from '../utils/rbac';
import {
    createWorkflowController,
    getWorkflowsController,
    getWorkflowController,
    updateWorkflowController,
    deleteWorkflowController,
    toggleWorkflowController,
    getWorkflowVersionsController,
    restoreVersionController
} from '../controllers/workflowController';

import {
  triggerManualController,
  getExecutionsController,
  getExecutionController
} from '../controllers/executionController';

// ─── Schemas ──────────────────────────────────────────────────

const workflowParamsSchema = z.object({
    orgId: z.string().uuid('Invalid org ID'),
    workflowId: z.string().uuid('Invalid workflow ID')
});

const orgParamsSchema = z.object({
    orgId: z.string().uuid('Invalid org ID')
});

const createWorkflowSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
    triggerType: z.enum(['WEBHOOK', 'SCHEDULE', 'MANUAL'] as const),
    cronExpression: z.string().optional(),
    graph: z.object({
        nodes: z.array(z.any()),
        edges: z.array(z.any())
    })
});

const updateWorkflowSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    cronExpression: z.string().optional(),
    graph: z.object({
        nodes: z.array(z.any()),
        edges: z.array(z.any())
    }).optional()
});

const restoreVersionSchema = z.object({
    version: z.coerce.number({ message: 'Version must be a number' })
});

// ─── Router ───────────────────────────────────────────────────

const router = Router({ mergeParams: true }); // mergeParams to access orgId from parent router

router.use(isAuth);
router.use(checkOrgMember);

// get all workflows — any member
router.get(
    '/',
    validate(orgParamsSchema, 'params'),
    getWorkflowsController
);

// create workflow — OWNER, ADMIN, EDITOR
router.post(
    '/',
    validate(orgParamsSchema, 'params'),
    checkOrgRole([Role.OWNER, Role.ADMIN, Role.EDITOR]),
    validate(createWorkflowSchema),
    createWorkflowController
);

// get single workflow — any member
router.get(
    '/:workflowId',
    validate(workflowParamsSchema, 'params'),
    getWorkflowController
);

// update workflow — OWNER, ADMIN, EDITOR
router.patch(
    '/:workflowId',
    validate(workflowParamsSchema, 'params'),
    checkOrgRole([Role.OWNER, Role.ADMIN, Role.EDITOR]),
    validate(updateWorkflowSchema),
    updateWorkflowController
);

// delete workflow — OWNER, ADMIN only
router.delete(
    '/:workflowId',
    validate(workflowParamsSchema, 'params'),
    checkOrgRole([Role.OWNER, Role.ADMIN]),
    deleteWorkflowController
);

// toggle enable/disable — OWNER, ADMIN, EDITOR
router.patch(
    '/:workflowId/toggle',
    validate(workflowParamsSchema, 'params'),
    checkOrgRole([Role.OWNER, Role.ADMIN, Role.EDITOR]),
    toggleWorkflowController
);

// get version history — any member
router.get(
    '/:workflowId/versions',
    validate(workflowParamsSchema, 'params'),
    getWorkflowVersionsController
);

// restore version — OWNER, ADMIN only
router.post(
    '/:workflowId/versions/restore',
    validate(workflowParamsSchema, 'params'),
    checkOrgRole([Role.OWNER, Role.ADMIN]),
    validate(restoreVersionSchema),
    restoreVersionController
);

// manual trigger -- OWNER, ADMIN, EDITOR
router.post(
  '/:workflowId/run',
  validate(workflowParamsSchema, 'params'),
  checkOrgRole([Role.OWNER, Role.ADMIN, Role.EDITOR]),
  triggerManualController
);

// get all executions for a workflow -- any member
router.get(
  '/:workflowId/executions',
  validate(workflowParamsSchema, 'params'),
  getExecutionsController
);

// get single execution with node logs -- any member
router.get(
  '/:workflowId/executions/:executionId',
  getExecutionController
);

export default router;