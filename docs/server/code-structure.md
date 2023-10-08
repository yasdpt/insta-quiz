# Code structure

In this guide you will learn how **InstaQuiz** server works and how you can extend it for your own usage.



## How it works

The application uses **Express.Js**, **Postgresql** in the server and **Socket.IO** on both ends for real-time synchronization between users in a game room.

### Data handling

Users, questions and game creation are handled by **REST API** using express routers.

And actions related to real-time running of the game such as sending game info to all users in game, receiving answers and updating leaderboard, starting the game loop and syncing questions for all users are handled by **Socket.IO event handlers**.

### Caching

For lowest latency while the game loop is running game info and game leaderboard are cached with [node-cache](https://www.npmjs.com/package/node-cache) that is an in memory key-value caching library

### Game logic

Game has 3 statuses:

* 0 = Created
* 1 = Running
* 2 = Ended

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
  handleGetWaitList(socket); 
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

## Socket events

Event structure

Each event is a function that takes a socket param as entry that receives events

and can have 3 different optional functions as parameters for emitting events to users:

* updateWaitList
* updateGameInfo
* updateLeaderboard

functions receive gameId as parameter and have an optional parameter for getting data from cache.

A socket event handler can have below structure:

```typescript
const handleEvent = (
  socket: Socket,
  updateGame: (gameId: number, fromCache: boolean) => any,
  updateLeaderboard: (gameId: number, fromCache: boolean) => any
) => {
  // callback is optional for returning data to user
  // should be included in client code to work
  socket.on("event", async (params..., callback) => {
    try {
      // Do actions

      // Return data to the user who emmited the event
      callback({
        status: 200,
        extraData: data,
      });
    } catch (error) {
      callback({
        status: 500,
        message: "error",
      });
    }
  });
};
```

&#x20;

### handleGetWaitList

Listens to `getWaitList` event from socket.

#### Input parameters

* gameId
* [gameStatus](code-structure.md#game-logic)

If game was ended it returns the leaderboard if not returns the list of users present in game.

Path: `./server/src/events/waitlist.ts`

### handleJoinGame

Listens to `joinGame` event from socket.

Input parameters

* userId
* gameId

If game was ended return error and if it was not the creator of the game add user to [game\_users](../database/schema.md) table cache leaderboard, return gameInfo and leaderboard.

Path: `./server/src/events/join.ts`

### handleAnswer

Listens to `gameAnswer` socket event.

Input parameters:

* gameId
* userId
* questionId
* answerId
* isCorrect

Get user answer, calculate score from game [`last_question_time`](../database/schema.md) field and save to database.

Path: ./server/src/events/answer.ts

### handleStartGame

Listens to `startGame` socket event.

Input parameters:

* userId
* gameId

If the game has not started it will be updated in the database, game info and leaderboard will be retrieved from the database, game loop starts and returns current data to the user who started the game.

Game loop emits questions each 15 seconds using timeout and all data is handled by cache the time of game running to ensure there is no delay.
