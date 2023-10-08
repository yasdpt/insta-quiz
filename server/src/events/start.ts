import { Socket } from "socket.io";
import pool from "../util/pool";
import { getCurrentGameInfo, getLeaderboardInfo } from "../util/game-util";
import moment from "moment";
import myCache from "../util/cache";
import gameLoop from "../util/game-loop";

// join user to room and callback gameInfo object or maybe just simple game info
// and broadcast scoreboard to other users when user joins
const handleStartGame = (
  socket: Socket,
  updateGame: (gameId: number, fromCache: boolean) => any,
  updateLeaderboard: (gameId: number, fromCache: boolean) => any
) => {
  socket.on("startGame", async (userId, gameId, callback) => {
    try {
      const client = await pool.connect();
      // Checks if user has a game and it's unstarted
      const gameResult = await client.query(
        "SELECT * FROM games WHERE id = $1 AND status = 0",
        [gameId]
      );

      if (gameResult.rowCount < 1) {
        callback({
          status: 404,
          message: "Game not found or already started!",
        });
        client.release();
        return;
      }

      // Error if user did not create the game
      if (userId !== gameResult.rows[0].owner_id) {
        callback({
          status: 403,
          message: "You are not the creator of the game!",
        });
        client.release();
        return;
      }

      const gameInfo = await getCurrentGameInfo(gameId);
      const leaderboardInfo = await getLeaderboardInfo(gameId);

      // Get time for creating the game (time of first question)
      const gameStartTime = moment().utc().format();
      // Update game in games table
      client.query(
        "UPDATE games SET status = 1, started_at = $1, last_question_time = $1 WHERE id = $2",
        [gameStartTime, gameId]
      );

      // Cache game info and leaderboard with 30 second timeout
      const cacheTTL = 30; // in seconds
      if (gameInfo && leaderboardInfo) {
        gameInfo.last_question_time = gameStartTime;
        gameInfo.status = 1;

        myCache.set(gameId.toString(), JSON.stringify(gameInfo), cacheTTL);
        myCache.set(
          `${gameId}-leaderboard`,
          JSON.stringify(leaderboardInfo),
          cacheTTL
        );
      }

      // Send game info and leaderboard info to all users using cache
      updateGame(gameId, false);
      updateLeaderboard(gameId, false);

      // Start game loop to handle question changes
      gameLoop(gameId, updateGame);

      client.release();

      // Return game info to current user
      callback({
        status: 200,
        game: gameInfo,
        leaderboard: leaderboardInfo,
      });
    } catch (error) {
      callback({
        status: 500,
        message: "Start game failed!",
      });
    }
  });
};

export default handleStartGame;
