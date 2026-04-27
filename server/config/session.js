import session from "express-session";
import RedisStore from "connect-redis";
import { getRedisClient } from "./redis.js";

export async function createSessionMiddleware() {
  const redisClient = await getRedisClient();

  return session({
    store: new RedisStore({
      client: redisClient
    }),
    name: "freemium.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  });
}
