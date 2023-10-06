import { readFileSync } from "fs";
import { Client } from "pg";
import { config } from "dotenv";

config();

const client = new Client({
  ssl: true,
});

async function createDb() {
  console.log("Creating database, this operation may take some time...");

  try {
    await client.connect();
    await processSQLFile("./db/queries/quizdb.sql");
    console.log("Created database");
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
    process.exit();
  }
}

async function processSQLFile(fileName) {
  // Extract SQL queries from files. Assumes no ';' in the fileNames
  const queries = readFileSync(fileName)
    .toString()
    .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
    .replace(/\s+/g, " ") // excess white space
    .split(";") // split into all statements
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function (el) {
      return el.length != 0;
    }); // remove any empty ones

  // Execute each SQL query sequentially
  for (let index = 0; index < queries.length; index++) {
    const query = queries[index];

    await client.query(query);
  }
}

createDb();
