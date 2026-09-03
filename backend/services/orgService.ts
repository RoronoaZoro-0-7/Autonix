import prisma from '../config/db';
import { Role } from '@prisma/client';
import { generateSlug } from '../utils/helpers';
import { AppError } from '../utils/AppError';

export const createOrg = async (
  userId: string,
  name: string,
  slug?: string
) => {
  const finalSlug = slug || generateSlug(name);

  const existing = await prisma.organization.findUnique({
    where: { slug: finalSlug }
  });
  if (existing) throw new AppError('Slug already taken — try a different name or provide a custom slug', 409);

  const org = await prisma.organization.create({
    data: {
      name,
      slug: finalSlug,
      members: {
        create: {
          userId,
          role: Role.OWNER
        }
      }
    }
  });

  return org;
};

export const getOrg = async (orgId: string) => {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    include: {
      _count: {
        select: {
          members: true,
          workflows: true
        }
      }
    }
  });
  if (!org) throw new AppError('Organization not found', 404);
  return org;
};

export const updateOrg = async (
  orgId: string,
  data: { name?: string; slug?: string }
) => {
  if (data.slug) {
    const existing = await prisma.organization.findUnique({
      where: { slug: data.slug }
    });
    if (existing && existing.id !== orgId) {
      throw new AppError('Slug already taken', 409);
    }
  }

  const updated = await prisma.organization.update({
    where: { id: orgId },
    data
  });

  return updated;
};

export const deleteOrg = async (orgId: string) => {
  await prisma.organization.delete({ where: { id: orgId } });
  return { message: 'Organization deleted successfully' };
};

export const inviteMember = async (
  orgId: string,
  inviterRole: Role,
  email: string,
  role: Role
) => {
  if (inviterRole === Role.ADMIN && (role === Role.ADMIN || role === Role.OWNER)) {
    throw new AppError('Admins can only invite Editors and Viewers', 403);
  }

  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) throw new AppError('No user found with that email', 404);

  const alreadyMember = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: targetUser.id } }
  });
  if (alreadyMember) throw new AppError('User is already a member of this organization', 409);

  const member = await prisma.orgMember.create({
    data: { orgId, userId: targetUser.id, role },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true
        }
      }
    }
  });

  return member;
};

export const getMembers = async (orgId: string) => {
  const members = await prisma.orgMember.findMany({
    where: { orgId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          isEmailVerified: true
        }
      }
    },
    orderBy: { joinedAt: 'asc' }
  });

  return members;
};

export const updateMemberRole = async (
  orgId: string,
  requesterId: string,
  requesterRole: Role,
  targetUserId: string,
  newRole: Role
) => {
  if (requesterId === targetUserId) {
    throw new AppError('Cannot change your own role', 400);
  }

  const targetMember = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: targetUserId } }
  });
  if (!targetMember) throw new AppError('Member not found', 404);

  if (requesterRole === Role.ADMIN && targetMember.role === Role.OWNER) {
    throw new AppError('Admins cannot change the role of an Owner', 403);
  }

  if (newRole === Role.OWNER) {
    throw new AppError('Cannot assign Owner role directly', 400);
  }

  const updated = await prisma.orgMember.update({
    where: { orgId_userId: { orgId, userId: targetUserId } },
    data: { role: newRole },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  return updated;
};

export const removeMember = async (
  orgId: string,
  requesterId: string,
  requesterRole: Role,
  targetUserId: string
) => {
  if (requesterId === targetUserId) {
    throw new AppError('Cannot remove yourself', 400);
  }

  const targetMember = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId: targetUserId } }
  });
  if (!targetMember) throw new AppError('Member not found', 404);

  if (requesterRole === Role.ADMIN && targetMember.role === Role.OWNER) {
    throw new AppError('Admins cannot remove an Owner', 403);
  }

  await prisma.orgMember.delete({
    where: { orgId_userId: { orgId, userId: targetUserId } }
  });

  return { message: 'Member removed successfully' };
};