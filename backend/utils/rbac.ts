import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { Role } from '@prisma/client';

export const checkOrgMember = async (req: Request, res: Response, next: NextFunction) => {
  const orgId = req.params.orgId as string;
  const userId = req.user!.userId;

  const member = await prisma.orgMember.findUnique({
    where: { orgId_userId: { orgId, userId } }
  });

  if (!member) {
    return res.status(403).json({
      success: false,
      message: 'You are not a member of this organization'
    });
  }

  req.orgRole = member.role;
  next();
};

export const checkOrgRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.orgRole || !roles.includes(req.orgRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};