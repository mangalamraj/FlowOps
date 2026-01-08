import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  // max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxLifetimeSeconds: 60,
});

export const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log("DB connected successfully!");
  } catch (error: any) {
    console.log("Unable to connect to DB", error.message);
    throw error;
  }
};

export const query = (text: string, params: any[] = []) =>
  pool.query(text, params);
