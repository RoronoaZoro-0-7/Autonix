import { Worker, Job } from 'bullmq';
import { connection } from '../config/redis';
import { WorkflowData } from '../queues/workflowQueue';
import { executeWorkflow } from './dagExecutor';
import prisma from '../config/db';
import { ExecutionStatus } from '@prisma/client';

const worker = new Worker<WorkflowData>(
    'workflow-execution',
    async (job: Job<WorkflowData>) => {
        console.log(`Processing job ${job.id} for workflow ${job.data.workflowId}`);
        await executeWorkflow(job.data);
    },
    {
        connection,
        concurrency: 10,  // max 10 jobs running simultaneously
    }
);

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed for workflow ${job.data.workflowId}`);
});

worker.on('failed', async (job, error) => {
    console.error(`Job ${job?.id} failed:`, error.message);

    // if all retries exhausted, mark execution as failed in DB
    if (job && job.attemptsMade >= (job.opts.attempts || 3)) {
        await prisma.execution.update({
            where: { id: job.data.executionId },
            data: {
                status: ExecutionStatus.FAILED,
                completedAt: new Date(),
                error: error.message
            }
        });
    }
});

worker.on('error', (error) => {
    console.error('Worker error:', error);
});

console.log('Worker started and waiting for jobs...');