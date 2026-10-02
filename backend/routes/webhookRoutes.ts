import { Router } from 'express';
import { triggerWebhookController } from '../controllers/executionController';

const router = Router();

// public -- no auth
router.post('/:webhookId', triggerWebhookController);

export default router;