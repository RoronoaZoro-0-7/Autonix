import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

type ValidateTarget = 'body' | 'params' | 'query';

export const validate = (schema: z.ZodType, target: ValidateTarget = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[target]);
        if (!result.success) {
            return res.status(400).json({
                message: 'Validation Error',
                errors: result.error.issues.map((e: z.ZodIssue) => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        req[target] = result.data;
        next();
    }
}