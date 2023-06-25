import { Redis } from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: 17946,
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USER,
});

export default redisClient;
