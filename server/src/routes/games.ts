import { Router } from "express";
import { verifyToken } from "../middleware/auth";
import pool from "../util/pool";
import sendGameDataToUser from "../util/bot-util";

const router = Router();

/* GET game by id*/
router.get("/:id", verifyToken, async function (req, res) {
  try {
    const gameId = req.params.id;
    const gameResult = await pool.query(
      `
      SELECT
        g.id,
        g.owner_id,
        g.category_id,
        g.status,
        u.first_name AS user_first_name,
        u.last_name AS user_last_name,
        c.name AS category_name
      FROM games AS g
      LEFT JOIN users AS u ON g.owner_id = u.id
      LEFT JOIN categories AS c ON g.category_id = c.id
      WHERE g.id = $1;
    `,
      [gameId]
    );

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
   Create game using userId and category
   add user to list of users in game 
   add questions to game_questions table
*/
router.post("/create", verifyToken, async function (req, res) {
  const {
    userId,
    categoryId,
    webAppQuery,
  }: { userId: number; categoryId: number; webAppQuery: string } = req.body;

  try {
    const client = await pool.connect();
    // Check if user already has games created
    const checkGame = await client.query(
      "SELECT * FROM games WHERE owner_id = $1 AND status = 0",
      [userId]
    );

    // if user already created 3 games return error
    if (checkGame.rowCount >= 3) {
      client.release();
      res.status(409).json({
        message: "You have already created 3 games!",
      });
    } else {
      // Get 10 random question filtering by category id
      const questionsRes = await client.query(
        "SELECT * FROM questions WHERE category_id = $1 ORDER BY random() LIMIT 10;",
        [categoryId]
      );

      // sort questions based on id
      const sortedQuestions = questionsRes.rows.sort((a, b) => a.id - b.id);

      // Create new game
      const createGameResult = await client.query(
        "INSERT INTO games (owner_id, category_id, current_question) VALUES ($1, $2, $3) RETURNING *",
        [userId, categoryId, sortedQuestions[0].id]
      );

      const gameId = createGameResult.rows[0].id;

      // Insert all questions to game_questions table
      for (const question of sortedQuestions) {
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
      client.release();

      res.status(201).json({
        message: "Game created successfuly!",
      });
    }
  } catch (error) {
    console.log("[POST] /game/create: " + error);
    res.status(500).json({ message: "Creating game failed!" });
  }
});

export default router;
