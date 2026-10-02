import redis from '../config/redis';

const workflow_cache_ttl = 60 * 60; // 1 hour in seconds

export const blacklistToken = async (token: string, expiresInSeconds: number) => {
    await redis.setex(`blacklist:${token}`, expiresInSeconds, '1');
}

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
    const result = await redis.get(`blacklist:${token}`);
    return result === '1';
}

export const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
        .replace(/\s+/g, '-')           // spaces to hyphens
        .replace(/-+/g, '-')            // multiple hyphens to one
}

export const cacheWorkflow = async (orgId: string, workflowId: string, data: any) => {
    await redis.setex(
        `workflow:${orgId}:${workflowId}`,
        workflow_cache_ttl,
        JSON.stringify(data)
    );
};

export const getCachedWorkflow = async (orgId: string, workflowId: string) => {
    const cached = await redis.get(`workflow:${orgId}:${workflowId}`);
    return cached ? JSON.parse(cached) : null;
};

export const invalidateWorkflowCache = async (orgId: string, workflowId: string) => {
    await redis.del(`workflow:${orgId}:${workflowId}`);
};

export const resolveTemplate = (template: string, input: any): string => {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
        const keys = path.trim().split('.');
        let value = { input, ...input };
        for (const key of keys) {
            value = value?.[key];
        }
        return value !== undefined ? String(value) : match;
    });
};