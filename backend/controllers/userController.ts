import { Response, Request, NextFunction } from 'express';
import { tryCatch } from '../utils/TryCatch';
import {
    getUserById,
    getUserOrgs,
    getUserOAuthAccounts,
    updateProfile,
    unlinkOAuth
} from '../services/userService';

export const getUserController = tryCatch(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(400).json({ success: false, message: 'User ID is required' });
        return;
    }
    const user = await getUserById(userId as string);
    if (user === null) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    if (user.avatarUrl === null) {
        user.avatarUrl = 'https://example.com/default-avatar.png'; // Set default avatar URL
    }
    res.json({ success: true, data: user });
});

export const orgsController = tryCatch(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(400).json({ success: false, message: 'User ID is required' });
        return;
    }
    const orgs = await getUserOrgs(userId as string);
    res.json({ success: true, data: orgs });
})

export const oAuthsController = tryCatch(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        res.status(400).json({ success: false, message: 'User ID is required' });
        return;
    }
    const oAuths = await getUserOAuthAccounts(userId as string);
    res.json({ success: true, data: oAuths });
})

export const updateProfileController = tryCatch(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await updateProfile(req.user!.userId, { name });
    res.json({ success: true, data: result });
});

export const unlinkOAuthController = tryCatch(async (req: Request, res: Response) => {
  const provider = req.params.provider as string;
  const result = await unlinkOAuth(req.user!.userId, provider);
  res.json({ success: true, data: result });
});