import { ScoreboardUser } from "../models/scoreboard";
import pool from "./pool";
import myCache from "./cache";
import { GameInfo } from "../models/game";

// Get game info and the current question and it's answers
const getCurrentGameInfo = async (
  gameId: number,
  fromCache: boolean = false
): Promise<GameInfo | undefined> => {
  if (fromCache) {
    const gameInfo = myCache.get<string>(gameId.toString());
    if (gameInfo) {
      return JSON.parse(gameInfo);
    }
  }

  const gameResult = await pool.query(
    `
    SELECT
      g.id, 
      g.owner_id,
      g.category_id,
      g.status,
      g.last_question_time,
      g.current_question,
      q.id AS question_id,
      q.text AS question,
      a.id AS answer_id, 
      a.text AS answer,
      a.is_correct
    FROM games AS g  
    LEFT JOIN game_questions AS gq ON g.id = gq.game_id
    LEFT JOIN questions AS q ON gq.question_id = q.id 
    LEFT JOIN answers AS a ON a.question_id = q.id
    WHERE g.id = $1;
    `,
    [gameId]
  );

  if (gameResult.rowCount > 0) {
    const game: GameInfo = {
      id: gameResult.rows[0].id,
      owner_id: gameResult.rows[0].owner_id,
      category_id: gameResult.rows[0].category_id,
      status: gameResult.rows[0].status,
      last_question_time: gameResult.rows[0].last_question_time,
      current_question: gameResult.rows[0].current_question,
      questions: [],
    };

    // Map to track questions by id
    const questionsMap = new Map();

    for (const row of gameResult.rows) {
      // See if question already exists
      let question = questionsMap.get(row.question_id);

      if (!question) {
        // Add new question object
        question = {
          id: row.question_id,
          text: row.question,
          answers: [],
        };

        // Save to map
        questionsMap.set(row.question_id, question);

        // Also add to game questions array
        game.questions.push(question);
      }

      // Now we can directly access the question object
      question.answers.push({
        id: row.answer_id,
        text: row.answer,
        is_correct: row.is_correct,
      });
    }

    return game;
  }
};

const getLeaderboardInfo = async (
  gameId: number,
  fromCache: boolean = false
): Promise<ScoreboardUser[] | undefined> => {
  if (fromCache) {
    const leaderboard = myCache.get<string>(`${gameId}-leaderboard`);
    if (leaderboard) {
      return JSON.parse(leaderboard);
    }
  }

  const sbResult = await pool.query(
    `
    SELECT
      u.id AS user_id,
      u.first_name,
      u.last_name,
      gu.score,
      gq.question_id AS question_id,
      a.id AS answer_id,
      a.is_correct
    FROM game_questions AS gq 
    LEFT JOIN game_users AS gu ON gq.game_id = gu.game_id
    LEFT JOIN users AS u ON gu.user_id = u.id
    LEFT JOIN game_user_answers AS gua ON gu.user_id = gua.user_id AND gq.question_id = gua.question_id
    LEFT JOIN answers AS a ON gua.answer_id = a.id
    WHERE gq.game_id = $1;
    `,
    [gameId]
  );

  const users = new Map<number, ScoreboardUser>();

  for (const row of sbResult.rows) {
    const userId = row.user_id;

    if (!users.has(userId)) {
      users.set(userId, {
        user_id: userId,
        first_name: row.first_name,
        last_name: row.last_name,
        score: row.score,
        answers: [],
      });
    }

    users.get(userId)?.answers.push({
      question_id: row.question_id,
      answer_id: row.answer_id,
      is_correct: row.is_correct,
    });
  }

  const leaderboard = Array.from(users.values());

  return leaderboard;
};

export { getCurrentGameInfo, getLeaderboardInfo };
