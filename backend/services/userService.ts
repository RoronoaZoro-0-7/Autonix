import prisma from '../config/db';
import { OAuthProvider } from '@prisma/client';
import { AppError } from '../utils/AppError';

export const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            twoFactorEnabled: true
        }
    });
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
}

export const getUserOrgs = async (userId: string) => {
    const orgs = await prisma.orgMember.findMany({
        where: { userId },
        include: {
            org: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    plan: true
                }
            }
        }
    })
    return orgs.map(m => ({
        org: m.org,
        role: m.role,
        joinedAt: m.joinedAt
    }))
}

export const getUserOAuthAccounts = async (userId: string) => {
    const accounts = await prisma.oAuthAccount.findMany({
        where: { userId },
        select: {
            provider: true,
            createdAt: true
        }
    });
    return accounts;
}

export const updateProfile = async (userId: string, data: { name?: string }) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            twoFactorEnabled: true,
            createdAt: true
        }
    });
    return user;
}

export const unlinkOAuth = async (userId: string, provider: string) => {
    if (!Object.values(OAuthProvider).includes(provider as OAuthProvider)) {
        throw new AppError('Invalid OAuth provider', 400);
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true }
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const oauthCount = await prisma.oAuthAccount.count({
        where: { userId }
    });

    if (!user.passwordHash && oauthCount <= 1) {
        throw new AppError('Cannot unlink your only login method. Set a password first.', 400);
    }

    const existing = await prisma.oAuthAccount.findFirst({
        where: { userId, provider: provider as OAuthProvider }
    });

    if (!existing) {
        throw new AppError(`${provider} is not linked to your account`, 404);
    }

    await prisma.oAuthAccount.deleteMany({
        where: { userId, provider: provider as OAuthProvider }
    });

    return { message: `${provider} unlinked successfully` };
};