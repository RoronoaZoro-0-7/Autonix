import { Request, Response, NextFunction } from 'express';
import { tryCatch } from '../utils/TryCatch';
import {
  register,
  verifyEmail,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword
} from '../services/authService';

export const registerController = tryCatch(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await register(name, email, password);
  res.status(201).json({ success: true, data: result });
});

export const verifyEmailController = tryCatch(async (req: Request, res: Response) => {
  const { token } = req.query as { token: string };
  const result = await verifyEmail(token);
  res.json({ success: true, data: result });
});

export const loginController = tryCatch(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await login(email, password);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    data: {
      accessToken: result.accessToken,
      user: result.user
    }
  });
});

export const refreshTokenController = tryCatch(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  const result = await refreshAccessToken(token);
  res.json({ success: true, data: result });
});

export const logoutController = tryCatch(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (refreshToken && accessToken) {
    await logout(refreshToken, accessToken);
  }

  res.clearCookie('refreshToken');
  res.json({ success: true, data: { message: 'Logged out successfully' } });
});

export const forgotPasswordController = tryCatch(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await forgotPassword(email);
  res.json({ success: true, data: result });
});

export const resetPasswordController = tryCatch(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  const result = await resetPassword(token, newPassword);
  res.json({ success: true, data: result });
});
