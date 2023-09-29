import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";

import indexRouter from "./routes/index";
import gameRouter from "./routes/game";
import { setupExtensions, handleErrors } from "./util/setup";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

setupExtensions(app);
handleErrors(app);

app.use("/", indexRouter);
app.use("/game", gameRouter);

io.on("connection", (socket: Socket) => {});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
