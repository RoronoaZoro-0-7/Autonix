import { Redis } from 'ioredis';

const redisUrl = new URL(process.env.REDIS_URL as string);

export const connection = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    password: redisUrl.password,
    tls: redisUrl.protocol === 'rediss:' ? {} : undefined,
}

const redis = new Redis(process.env.REDIS_URL as string);

redis.on('connect', () => console.log('redis connected'));
redis.on('error', (err) => console.log(err));

export default redis;