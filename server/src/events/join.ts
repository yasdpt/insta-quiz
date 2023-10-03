import { Socket } from "socket.io";
import pool from "../util/pool";
import { getCurrentGameInfo } from "../util/game-util";

// join user to room and callback gameInfo object or maybe just simple game info
// and broadcast scoreboard to other users when user joins
const handleJoinGame = (
  socket: Socket,
  updateLeaderboard: (gameId: number) => any
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

      // Check if user is already in game
      const joinCheckRes = await client.query(
        "SELECT * FROM game_users WHERE game_id = $1 AND user_id = $2",
        [gameId, userId]
      );

      // Add user to game_users table if it's not the creator of the game
      // and has not already joined the game
      if (gameResult.rows[0].owner_id !== userId && joinCheckRes.rowCount < 1) {
        await client.query(
          "INSERT * INTO game_users (game_id, user_id) VALUES ($1, 2$)",
          [gameId, userId]
        );
      }

      // Join game info socket broadcast room
      socket.join(gameId.toString());

      // Get game info and leaderboard
      const gameInfo = await getCurrentGameInfo(gameId);

      // Send leaderboard info to all users
      updateLeaderboard(gameId);

      // Return game info to current user
      callback({
        status: 200,
        game: gameInfo,
      });
    } catch (error) {
      callback({
        status: 500,
        message: "Join failed!",
      });
    } finally {
      client.release();
    }
  });
};

export default handleJoinGame;
