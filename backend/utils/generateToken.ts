import jwt from 'jsonwebtoken';
import prisma from '../config/db';

export const generateAccessToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: (process.env.JWT_ACCESS_EXPIRES || '15m') as jwt.SignOptions['expiresIn'] }
  )
}

export const generateRefreshToken = (userId:string) => {
    return jwt.sign({userId},
        process.env.JWT_REFRESH_SECRET as string,
        {expiresIn:'7d'}
    );
}