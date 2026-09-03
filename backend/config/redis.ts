import {Redis } from 'ioredis';

export const connection = {
    host: process.env.REDIS_URL,
    port: 6379,
    password: process.env.REDIS_URL
}

const redis = new Redis(process.env.REDIS_URL as string);

redis.on('connect',() => console.log('redis connected'));
redis.on('error',(err) => console.log(err));

export default redis;