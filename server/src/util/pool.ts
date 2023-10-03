import { Pool, types } from "pg";
types.setTypeParser(20, function (val) {
  return parseInt(val, 10);
});
const pool = new Pool({
  ssl: true,
});

export default pool;
