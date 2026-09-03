import { Router } from 'express';
import {
    registerController,
    verifyEmailController,
    loginController,
    refreshTokenController,
    logoutController,
    forgotPasswordController,
    resetPasswordController
} from '../controllers/authController';
import { validate } from '../middlewares/validator_middleware';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema
} from '../utils/validators';
import isAuth from '../middlewares/isAuth';

const router = Router();

router.post('/register', validate(registerSchema), registerController);
router.get('/verify-email', verifyEmailController);
router.post('/login', validate(loginSchema), loginController);
router.post('/refresh', refreshTokenController);
router.post('/logout',isAuth, logoutController);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPasswordController);
router.post('/reset-password', validate(resetPasswordSchema), resetPasswordController);

export default router;