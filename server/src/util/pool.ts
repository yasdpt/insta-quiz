import { Pool } from "pg";
const pool = new Pool({
  ssl: true,
});

export default pool;
