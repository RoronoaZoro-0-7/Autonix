import { Request, Response } from 'express';
import { tryCatch } from '../utils/TryCatch';
import { Role } from '@prisma/client';
import {
  createOrg,
  getOrg,
  updateOrg,
  deleteOrg,
  inviteMember,
  getMembers,
  updateMemberRole,
  removeMember
} from '../services/orgService';

export const createOrgController = tryCatch(async (req: Request, res: Response) => {
  const { name, slug } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

  const result = await createOrg(req.user!.userId, name, slug);
  res.status(201).json({ success: true, data: result });
});

export const getOrgController = tryCatch(async (req: Request, res: Response) => {
  const orgId = req.params.orgId as string;
  if (!orgId) return res.status(400).json({ success: false, message: 'Organization ID is required' });

  const result = await getOrg(orgId);
  res.json({ success: true, data: result });
});

export const updateOrgController = tryCatch(async (req: Request, res: Response) => {
  const orgId = req.params.orgId as string;
  if (!orgId) return res.status(400).json({ success: false, message: 'Organization ID is required' });

  const { name, slug } = req.body;
  if (!name && !slug) return res.status(400).json({ success: false, message: 'At least one field is required' });

  const result = await updateOrg(orgId, { name, slug });
  res.json({ success: true, data: result });
});

export const deleteOrgController = tryCatch(async (req: Request, res: Response) => {
  const orgId = req.params.orgId as string;
  if (!orgId) return res.status(400).json({ success: false, message: 'Organization ID is required' });

  const result = await deleteOrg(orgId);
  res.json({ success: true, data: result });
});

export const inviteMemberController = tryCatch(async (req: Request, res: Response) => {
  const orgId = req.params.orgId as string;
  if (!orgId) return res.status(400).json({ success: false, message: 'Organization ID is required' });

  const { email, role } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
  if (!role) return res.status(400).json({ success: false, message: 'Role is required' });

  const result = await inviteMember(orgId, req.orgRole!, email, role as Role);
  res.status(201).json({ success: true, data: result });
});

export const getMembersController = tryCatch(async (req: Request, res: Response) => {
  const orgId = req.params.orgId as string;
  if (!orgId) return res.status(400).json({ success: false, message: 'Organization ID is required' });

  const result = await getMembers(orgId);
  res.json({ success: true, data: result });
});

export const updateMemberRoleController = tryCatch(async (req: Request, res: Response) => {
  const orgId = req.params.orgId as string;
  const targetUserId = req.params.userId as string;
  if (!orgId) return res.status(400).json({ success: false, message: 'Organization ID is required' });
  if (!targetUserId) return res.status(400).json({ success: false, message: 'User ID is required' });

  const { role } = req.body;
  if (!role) return res.status(400).json({ success: false, message: 'Role is required' });

  const result = await updateMemberRole(
    orgId,
    req.user!.userId,
    req.orgRole!,
    targetUserId,
    role as Role
  );
  res.json({ success: true, data: result });
});

export const removeMemberController = tryCatch(async (req: Request, res: Response) => {
  const orgId = req.params.orgId as string;
  const targetUserId = req.params.userId as string;
  if (!orgId) return res.status(400).json({ success: false, message: 'Organization ID is required' });
  if (!targetUserId) return res.status(400).json({ success: false, message: 'User ID is required' });

  const result = await removeMember(
    orgId,
    req.user!.userId,
    req.orgRole!,
    targetUserId
  );
  res.json({ success: true, data: result });
});