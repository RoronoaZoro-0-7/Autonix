import { Queue } from 'bullmq';
import { connection } from '../config/redis';
import { TriggerType } from '@prisma/client';

export interface WorkflowData {
    workflowId: string;
    executionId: string;
    orgId: string;
    triggerType: TriggerType;
    triggerData: Record<string, any>;
}

export const workflowQueue = new Queue<WorkflowData>('workflow', {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000
        },
        removeOnComplete: { count: 100 }, //keep last 100 jobs,
        removeOnFail: { count: 50 } //keep last 50 failed jobs
    }
});

export const addWorkflowJob = async(data: WorkflowData) => {
    await workflowQueue.add('execute', data,{
        jobId: data.executionId // jobId same as executionId
    });
}