import pg from "pg";

const { Pool } = pg;
export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "miniblog",
  password: "juniores12L@",
  port: 5432,
});
