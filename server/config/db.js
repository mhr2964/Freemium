import mongoose from "mongoose";

let connectionPromise;

export async function getDb() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: "freemium"
    });
  }

  await connectionPromise;

  // Read the active db handle at use time so cold starts do not capture null.
  return mongoose.connection.db;
}
