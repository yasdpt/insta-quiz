import express from "express";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server, Socket } from "socket.io";

import {
  homeRouter,
  gamesRouter,
  categoriesRouter,
  usersRouter,
} from "./routes";
import { setupExtensions, handleErrors } from "./util/setup";
import { handleAnswer, handleJoinGame } from "./events";
import verifyToken from "./middleware/auth";
import { getCurrentGameInfo, getLeaderboardInfo } from "./util/game-util";
import handleStartGame from "./events/start";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT;

const app = express();
const server = createServer(app);
const io = new Server(server);

setupExtensions(app);
io.engine.use(verifyToken);

app.use("/", homeRouter);
app.use("/games", gamesRouter);
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);

io.on("connection", (socket: Socket) => {
  handleJoinGame(socket, updateLeaderboard);
  handleAnswer(socket, updateLeaderboard);
  handleStartGame(socket, updateGame, updateLeaderboard);
});

const updateLeaderboard = async (
  gameId: number,
  fromCache: boolean = false
) => {
  const leaderboardInfo = await getLeaderboardInfo(gameId, fromCache);
  io.to(gameId.toString()).emit("updateLeaderboard", leaderboardInfo);
};

const updateGame = async (gameId: number, fromCache: boolean = false) => {
  const gameInfo = await getCurrentGameInfo(gameId, fromCache);
  io.to(gameId.toString()).emit("updateGame", gameInfo);
};

handleErrors(app);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
