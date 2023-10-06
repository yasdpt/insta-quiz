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
import { setupExtensions, handleErrors, corsWhiteList } from "./util/setup";
import {
  handleAnswer,
  handleGetWaitListGame,
  handleJoinGame,
  handleStartGame,
} from "./events";
import {
  getCurrentGameInfo,
  getLeaderboardInfo,
  getWailList,
} from "./util/game-util";
import { verifyTokenSocket } from "./middleware/auth";

// Config env only in production if deploying to services
// that automatically handle env config, remove statement otherwise
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT;

const app = express();

// Create http server
const server = createServer(app);

// Create socket.io server
const io = new Server(server, {
  cors: {
    origin: corsWhiteList(),
  },
});

// Mount express plugins
setupExtensions(app);

// Mount express routes
app.use("/", homeRouter);
app.use("/games", gamesRouter);
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);

// Verify initData token
io.use(verifyTokenSocket);

// Handle socket connection and events
io.on("connection", (socket: Socket) => {
  handleGetWaitListGame(socket);
  handleJoinGame(socket, updateLeaderboard, updateWaitList);
  handleAnswer(socket, updateLeaderboard);
  handleStartGame(socket, updateGame, updateLeaderboard);
});

// Update game subscription wait list
const updateWaitList = async (gameId: number) => {
  const waitList = await getWailList(gameId);
  io.to(gameId.toString()).emit("updateWaitList", waitList);
};

// Update game subscription game status
const updateGame = async (gameId: number, fromCache: boolean = false) => {
  const gameInfo = await getCurrentGameInfo(gameId, fromCache);
  io.to(gameId.toString()).emit("updateGame", gameInfo);
};

// Update game subscription leaderboard
const updateLeaderboard = async (
  gameId: number,
  fromCache: boolean = false
) => {
  const leaderboardInfo = await getLeaderboardInfo(gameId, fromCache);
  io.to(gameId.toString()).emit("updateLeaderboard", leaderboardInfo);
};

// Handle forwarded express errors
handleErrors(app);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
