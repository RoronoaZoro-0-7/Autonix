import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';

export const tryCatch = (fn:Function) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ success: false, message: error.message });
            }
            const message = error instanceof Error ? error.message : 'Internal Server Error';
            return res.status(500).json({ success: false, message });
        }
    }
}