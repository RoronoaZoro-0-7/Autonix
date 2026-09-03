import { Router } from 'express';
import { z } from 'zod';
import prisma from '../config/db';
import { Role } from '@prisma/client';
import isAuth from '../middlewares/isAuth';
import { validate } from '../middlewares/validator_middleware';
import { checkOrgMember, checkOrgRole } from '../utils/rbac';
import {
    createOrgController,
    getOrgController,
    updateOrgController,
    deleteOrgController,
    inviteMemberController,
    getMembersController,
    updateMemberRoleController,
    removeMemberController
} from '../controllers/orgController';

// ─── Schemas ──────────────────────────────────────────────────

const createOrgSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string()
        .min(2)
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens')
        .optional()
});

const updateOrgSchema = z.object({
    name: z.string().min(2).optional(),
    slug: z.string()
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens')
        .optional()
});

const inviteMemberSchema = z.object({
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).refine(
        (val) => ['ADMIN', 'EDITOR', 'VIEWER'].includes(val),
        { message: 'Role must be ADMIN, EDITOR or VIEWER' }
    )
});

const updateRoleSchema = z.object({
    role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']).refine(
        (val) => ['ADMIN', 'EDITOR', 'VIEWER'].includes(val),
        { message: 'Role must be ADMIN, EDITOR or VIEWER' }
    )
});

const orgParamsSchema = z.object({
    orgId: z.string().uuid('Invalid org ID')
});

const memberParamsSchema = z.object({
    orgId: z.string().uuid('Invalid org ID'),
    userId: z.string().uuid('Invalid user ID')
});

// ─── Router ───────────────────────────────────────────────────

const router = Router();

// ─── Public ───────────────────────────────────────────────────

router.get('/check-slug', async (req, res) => {
    const { slug } = req.query as { slug: string };
    if (!slug) return res.status(400).json({ success: false, message: 'Slug is required' });

    const existing = await prisma.organization.findUnique({ where: { slug } });
    res.json({ success: true, data: { available: !existing } });
});

// ─── Protected ────────────────────────────────────────────────

router.use(isAuth);

// create org — any authenticated user
router.post(
    '/',
    validate(createOrgSchema),
    createOrgController
);

// get org — any member
router.get(
    '/:orgId',
    validate(orgParamsSchema, 'params'),
    checkOrgMember,
    getOrgController
);

// update org — OWNER or ADMIN
router.patch(
    '/:orgId',
    validate(orgParamsSchema, 'params'),
    checkOrgMember,
    checkOrgRole([Role.OWNER, Role.ADMIN]),
    validate(updateOrgSchema),
    updateOrgController
);

// delete org — OWNER only
router.delete(
    '/:orgId',
    validate(orgParamsSchema, 'params'),
    checkOrgMember,
    checkOrgRole([Role.OWNER]),
    deleteOrgController
);

// invite member — OWNER or ADMIN
router.post(
    '/:orgId/members/invite',
    validate(orgParamsSchema, 'params'),
    checkOrgMember,
    checkOrgRole([Role.OWNER, Role.ADMIN]),
    validate(inviteMemberSchema),
    inviteMemberController
);

// get all members — any member
router.get(
    '/:orgId/members',
    validate(orgParamsSchema, 'params'),
    checkOrgMember,
    getMembersController
);

// update member role — OWNER or ADMIN
router.patch(
    '/:orgId/members/:userId',
    validate(memberParamsSchema, 'params'),
    checkOrgMember,
    checkOrgRole([Role.OWNER, Role.ADMIN]),
    validate(updateRoleSchema),
    updateMemberRoleController
);

// remove member — OWNER or ADMIN
router.delete(
    '/:orgId/members/:userId',
    validate(memberParamsSchema, 'params'),
    checkOrgMember,
    checkOrgRole([Role.OWNER, Role.ADMIN]),
    removeMemberController
);

export default router;