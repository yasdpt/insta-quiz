import { Router } from "express";
import verifyToken from "../middleware/auth";
import pool from "../util/pool";
import sendGameDataToUser from "../util/bot-util";

const router = Router();

/* GET game by id */
router.get("/:id", verifyToken, async function (req, res) {
  try {
    const gameId = req.params.id;
    const gameResult = await pool.query("SELECT * FROM games WHERE id = $1", [
      gameId,
    ]);

    if (gameResult.rowCount > 0) {
      res.status(200).json(gameResult.rows[0]);
    } else {
      res.status(404).json({ message: "Game not found!" });
    }
  } catch (error) {
    console.log("[GET] /game/{id}: " + error);
    res.status(500).json({ message: "Failed to get game!" });
  }
});

/* POST 
   Create game using userId and category and add user to list of users in game 
*/
router.post("/create", verifyToken, async function (req, res) {
  const {
    userId,
    categoryId,
    webAppQuery,
  }: { userId: number; categoryId: number; webAppQuery: string } = req.body;
  const client = await pool.connect();
  try {
    // Check if user already has a game created and it is not started yet and return that
    const checkGame = await client.query(
      "SELECT * FROM games WHERE owner_id = $1 AND status = 0",
      [userId]
    );

    if (checkGame.rowCount > 0) {
      res.status(200).json(checkGame.rows[0]);
    } else {
      // Get 10 random question filtering by category id
      const questionsRes = await client.query(
        "SELECT * FROM questions WHERE category_id = $1 ORDER BY random() LIMIT 10;",
        [categoryId]
      );

      // Create new game
      const createGameResult = await client.query(
        "INSERT INTO games (owner_id, category_id, current_question) VALUES ($1, $2, $3) RETURNING *",
        [userId, categoryId, questionsRes.rows[0].id]
      );

      const gameId = createGameResult.rows[0].id;

      // Insert all questions to game_questions table
      for (const question of questionsRes.rows) {
        await client.query(
          "INSERT INTO game_questions (game_id, question_id) VALUES ($1, $2);",
          [gameId, question.id]
        );
      }

      // Add user to game based on returned game id from last query
      await client.query(
        "INSERT INTO game_users (game_id, user_id) VALUES ($1, $2)",
        [gameId, userId]
      );

      // Send answerWebAppQuery inline result to user with your bot
      // so their friends could join the game.
      await sendGameDataToUser(webAppQuery, gameId, categoryId);

      res.status(201).json(createGameResult.rows[0]);
    }
  } catch (error) {
    console.log("[POST] /game/create: " + error);
    res.status(500).json({ message: "Creating game failed!" });
  } finally {
    client.release();
  }
});

export default router;
