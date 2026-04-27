import { createClient } from "redis";

let redisClient;
let redisPromise;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on("error", (error) => {
      console.error("Redis client error", error);
    });
  }

  if (!redisPromise) {
    redisPromise = redisClient.connect();
  }

  await redisPromise;

  return redisClient;
}
