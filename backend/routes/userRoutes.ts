import {Router} from 'express';
import { z } from 'zod';
import {
    getUserController,
    orgsController,
    oAuthsController,
    updateProfileController,
    unlinkOAuthController
} from '../controllers/userController';
import isAuth from '../middlewares/isAuth';
import { validate } from '../middlewares/validator_middleware';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional()
});

const oauthProviderSchema = z.object({
  provider: z.string().transform(v => v.toUpperCase()).pipe(
    z.enum(['GOOGLE', 'GITHUB'], 'Provider must be GOOGLE or GITHUB')
  )
});

const router = Router();
router.use(isAuth);

router.get('/me', getUserController);
router.get('/orgs', orgsController);
router.get('/oauths', oAuthsController);
router.put('/profile',validate(updateProfileSchema), updateProfileController);
router.delete('/unlink/:provider', validate(oauthProviderSchema, 'params'), unlinkOAuthController);

export default router;