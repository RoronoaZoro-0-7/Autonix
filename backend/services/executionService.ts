import prisma from '../config/db';
import { addWorkflowJob } from '../queues/workflowQueue';
import { ExecutionStatus, TriggerType } from '@prisma/client';
import { AppError } from '../utils/AppError';
import { v4 as uuidv4 } from 'uuid';

export const triggerManualExecution = async (
    orgId: string,
    workflowId: string,
    userId: string
) => {

    const workflow = await prisma.workflow.findFirst({
        where: {
            id: workflowId,
            orgId,
            isDeleted: false,
            isActive: true
        }
    });

    if (!workflow) {
        throw new AppError('Workflow not found or inactive', 401);
    }

    const newExecution = await prisma.execution.create({
        data: {
            // id:executionId,
            workflowId,
            triggeredBy: TriggerType.MANUAL,
            status: ExecutionStatus.PENDING,
            triggerData: { triggeredBy: userId }
        }
    });

    await addWorkflowJob({
        workflowId,
        executionId: newExecution.id,
        orgId,
        triggerType: 'MANUAL',
        triggerData: { triggeredBy: userId }
    });

    return { executionId: newExecution.id, message: 'Workflow triggered' };
}

export const triggerWebhookExecution = async (
    webhookUrl: string,
    signature: string | undefined,
    triggerData: {
        headers: any,
        body: any,
        query: any
    }
) => {
    const workflow = await prisma.workflow.findFirst({
        where: {
            webhookUrl,
            isDeleted: false,
            isActive: true
        }
    });

    if (!workflow) {
        throw new AppError('Workflow not found or inactive', 401);
    }

    // verify hmac signature if provided
    if (signature && workflow.webhookSecret) {
        const crypto = await import('crypto');

        const expectedSig = crypto
            .createHmac('sha256', workflow.webhookSecret)
            .update(JSON.stringify(triggerData.body))
            .digest('hex');

        const isValid = crypto.timingSafeEqual(
            Buffer.from(signature.replace('sha256=', '')),
            Buffer.from(expectedSig)
        );

        if (!isValid) throw new AppError('Invalid webhook signature', 401);
    }

    const executionId = uuidv4();

    await prisma.execution.create({
        data: {
            id: executionId,
            workflowId: workflow.id,
            triggeredBy: TriggerType.WEBHOOK,
            status: ExecutionStatus.PENDING,
            triggerData
        }
    });

    await addWorkflowJob({
        workflowId: workflow.id,
        executionId,
        orgId: workflow.orgId,
        triggerType: 'WEBHOOK',
        triggerData
    });

    return { executionId, message: 'Webhook received' };
}

export const getExecutions = async (orgId: string, workflowId: string) => {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, orgId, isDeleted: false }
  });

  if (!workflow) throw new AppError('Workflow not found', 404);

  const executions = await prisma.execution.findMany({
    where: { workflowId },
    orderBy: { startedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      status: true,
      triggeredBy: true,
      startedAt: true,
      completedAt: true,
      durationMs: true,
      error: true
    }
  });

  return executions;
};

export const getExecution = async (orgId: string, workflowId: string, executionId: string) => {
  const workflow = await prisma.workflow.findFirst({
    where: { id: workflowId, orgId, isDeleted: false }
  });

  if (!workflow) throw new AppError('Workflow not found', 404);

  const execution = await prisma.execution.findFirst({
    where: { id: executionId, workflowId },
    include: {
      nodeLogs: {
        orderBy: { startedAt: 'asc' }
      }
    }
  });

  if (!execution) throw new AppError('Execution not found', 404);

  return execution;
};