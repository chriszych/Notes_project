import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on("error", (err) => {
  console.error("Unexpected error connection with PostgreSQL server:", err);
});

export default db;
