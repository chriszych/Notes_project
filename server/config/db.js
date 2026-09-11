import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "notes",
  password: "123456",
  port: 5432,
});
db.connect();

export default db;