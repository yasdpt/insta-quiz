import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";

import { homeRouter, gameRouter, categoriesRouter } from "./routes";
import { setupExtensions, handleErrors } from "./util/setup";
import { handleJoinGame } from "./events";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

setupExtensions(app);
handleErrors(app);

app.use("/", homeRouter);
app.use("/game", gameRouter);
app.use("/categories", categoriesRouter);

io.on("connection", (socket: Socket) => {
  handleJoinGame(socket, (gameId) => {});
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
