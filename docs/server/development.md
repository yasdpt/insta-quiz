# Development

In this guide you will learn how **InstaQuiz** server works and how you can extend it for your own usage.



## How it works

The application uses **Express.Js**, **Postgresql** in the server and **Socket.IO** on both ends for real-time synchronization between users in a game room.

### Data handling

Users, questions and game creation are handled by **REST API** using express routers.

And actions related to real-time running of the game such as sending game info to all users in game, receiving answers and updating leaderboard, starting the game loop and syncing questions for all users are handled by **Socket.IO event handlers**.

### Caching

For lowest latency while the game loop is running game info and game leaderboard are cached with [node-cache](https://www.npmjs.com/package/node-cache) that is an in memory key-value caching library

### Game logic

Each game contains **10 questions** that are randomly selected based on the category selected by the user while creating the game.

Anyone with the link to the game can join and if users lose connection or crash can rejoin if the game is still running.

Users can see who is in the game before joining if the game is ended the results will be displayed instead.

Each question has **15 seconds** timeout and if the user answers in the first 6 seconds they will receive the complete score that is **10** and after that each delayed second lowers the score by **1**, the code for this logic is located at `./server/src/events/answer.ts`

## Code

The main entry for the application is located at ./server/src/app.js and it will be run when the app starts and sets up an **Express.Js** app, it's middlewares, routes, **Socket.io** events handler and event emitters.

#### Setup express

```typescript
const app = express();

// Create http server
const server = createServer(app);

// Mount express middlewares, located at ./server/src/util/setup.ts
setupMiddlewares(app);

// Mount express routes ./server/src/routes
app.use("/", homeRouter);
app.use("/games", gamesRouter); // Handles game creation and game info
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter); // User upsert

```

#### Setup Socket.IO

```typescript
// Create Socket.IO instance with http server from previous step
const io = new Server(server, {
  cors: {
    origin: corsWhiteList(), // List of client URLs that can connect to server
  },
});

// Mount auth middleware for Socket.IO
io.use(verifyTokenSocket);

// Handle socket connection and events, ./server/src/events
io.on("connection", (socket: Socket) => {
  handleGetWaitListGame(socket); 
  handleJoinGame(socket, updateLeaderboard, updateWaitList);
  handleAnswer(socket, updateLeaderboard);
  handleStartGame(socket, updateGame, updateLeaderboard);
});

// Socket.IO room emitters
// Sends real-time data to game rooms using gameId

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
```
