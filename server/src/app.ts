import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";

import { setupExtensions, handleErrors } from "./util/setup";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT;

const app = express();
const server = createServer(app);

setupExtensions(app);
handleErrors(app);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
