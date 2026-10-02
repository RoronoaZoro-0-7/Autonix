import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/db';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import { blacklistToken, isTokenBlacklisted } from '../utils/helpers';
import { sendEmail, getVerificationEmailHtml, getPasswordResetEmailHtml } from '../utils/email';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';

export const register = async (name: string, email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new AppError('Email already exists', 409);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');


    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            emailVerifyToken,
        }
    });

    await sendEmail({
        to: email,
        subject: 'Verify your Autonix account',
        html: getVerificationEmailHtml(name, emailVerifyToken)
    });

    return { message: 'Verification email sent' };
};

export const verifyEmail = async (token: string) => {
    const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
    if (!user) throw new AppError('Invalid or expired token', 400);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            isEmailVerified: true,
            emailVerifyToken: null
        }
    });

    return { message: 'Email verified successfully' };
};

export const login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    // user exists but registered via OAuth — no password set
    if (!user.passwordHash) {
        throw new AppError('This account uses Google or GitHub login. Please sign in with OAuth.', 400);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash!);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    if (!user.isEmailVerified){
        throw new AppError('Please verify your email first', 403);
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
        data: {
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });

    return {
        accessToken,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email }
    };
};

export const refreshAccessToken = async (token: string) => {
    const dbToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true }
    });

    if (!dbToken || dbToken.revoked) throw new AppError('Invalid refresh token', 401);
    if (dbToken.expiresAt < new Date()) throw new AppError('Refresh token expired', 401);

    const accessToken = generateAccessToken(dbToken.user.id, dbToken.user.email);

    return { accessToken };
};

export const logout = async (refreshToken: string, accessToken: string) => {
    await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true }
    });

    const decoded = jwt.decode(accessToken) as any;
    if (decoded && decoded.exp) {
        const remainingSeconds = Math.floor((decoded.exp * 1000 - Date.now()) / 1000);
        if (remainingSeconds > 0) {
            await blacklistToken(accessToken, remainingSeconds);
        }
    }

    return { message: 'Logged out successfully' };
};

export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    // always return same message — don't reveal if email exists
    if (!user) return { message: 'If that email exists you will receive a reset link' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordResetToken: hashedToken,
            passwordResetExpiry: new Date(Date.now() + 60 * 60 * 1000)
        }
    });

    await sendEmail({
        to: email,
        subject: 'Reset your Autonix password',
        html: getPasswordResetEmailHtml(user.name, resetToken)
    });

    return { message: 'If that email exists you will receive a reset link' };
};

export const resetPassword = async (token: string, newPassword: string) => {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
        where: { passwordResetToken: hashedToken }
    });

    if (!user) throw new AppError('Invalid or expired token', 400);
    if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
        throw new AppError('Reset token has expired', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordHash,
            passwordResetToken: null,
            passwordResetExpiry: null
        }
    });

    // revoke all refresh tokens — force re-login everywhere
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    return { message: 'Password reset successful' };
};