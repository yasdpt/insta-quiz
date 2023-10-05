import { Socket } from "socket.io";
import pool from "../util/pool";
import { getCurrentGameInfo, getLeaderboardInfo } from "../util/game-util";
import myCache from "../util/cache";

// join user to room and callback gameInfo object or maybe just simple game info
// and broadcast scoreboard to other users when user joins
const handleJoinGame = (
  socket: Socket,
  updateLeaderboard: (gameId: number, fromCache: boolean) => any,
  updateWaitList: (gameId: number) => any
) => {
  socket.on("joinGame", async (userId: number, gameId: number, callback) => {
    const client = await pool.connect();
    try {
      const gameResult = await client.query(
        "SELECT * FROM games WHERE id = $1 AND (status = 0 OR status = 1)",
        [gameId]
      );

      if (gameResult.rowCount < 1) {
        callback({
          status: 404,
          message: "Game not found or ended!",
        });
        return;
      }

      // If user is not owner of the game try adding them to game
      if (gameResult.rows[0].owner_id !== userId) {
        // Check if user is already in game
        const joinCheckRes = await client.query(
          "SELECT * FROM game_users WHERE game_id = $1 AND user_id = $2",
          [gameId, userId]
        );

        // If the game is ongoing and user did not join before send them an error
        if (gameResult.rows[0].status === 1 && joinCheckRes.rowCount < 1) {
          callback({
            status: 403,
            message: "Game has already started, you can not join in progress!",
          });
          return;
        }

        // Add user to game_users table if they have not already joined the game
        if (joinCheckRes.rowCount < 1) {
          await client.query(
            "INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)",
            [gameId, userId]
          );
        }
      }

      // Join game info socket broadcast room
      socket.join(gameId.toString());

      // Get game info
      // Get game info from cache if is ongoing
      const gameInfo = await getCurrentGameInfo(
        gameId,
        gameResult.rows[0].status === 1
      );

      // Get leaderboard info
      const leaderboardInfo = await getLeaderboardInfo(gameId);

      const cacheTTL = 30;

      myCache.set(
        `${gameId}-leaderboard`,
        JSON.stringify(leaderboardInfo),
        cacheTTL
      );

      // Send leaderboard info to all users
      updateLeaderboard(gameId, true);
      updateWaitList(gameId);

      // Return game info to current user
      callback({
        status: 200,
        game: gameInfo,
        leaderboard: leaderboardInfo,
      });
    } catch (error) {
      console.log(`Join error: ${error}`);
      callback({
        status: 500,
        message: "Unknown error!",
      });
    } finally {
      client.release();
    }
  });
};

export default handleJoinGame;
