import moment from "moment";
import { Socket } from "socket.io";
import { getCurrentGameInfo, getLeaderboardInfo } from "../util/game-util";
import pool from "../util/pool";
import myCache from "../util/cache";

const cacheTTL = 30; // in seconds

/**
 * Get user answer, calculate score and update database
 */
const handleAnswer = (
  socket: Socket,
  updateLeaderboard: (gameId: number, fromCache: boolean) => any
) => {
  socket.on(
    "gameAnswer",
    async (gameId, userId, questionId, answerId, isCorrect) => {
      try {
        // log time of receiving answer in UTC
        const timeAnswered = moment().utc().format();

        // get game info from database
        const gameInfo = await getCurrentGameInfo(gameId, true);

        // Get time difference of the time question was asked and answered in seconds
        const timeDifference = moment(timeAnswered).diff(
          moment(gameInfo?.last_question_time),
          "seconds"
        );

        let score: number = 0;

        if (isCorrect) {
          score = calculateScore(timeDifference);
        }

        pool.query(
          "INSERT INTO game_user_answers(user_id, game_id, question_id, answer_id) VALUES ($1, $2, $3, $4)",
          [userId, gameId, questionId, answerId]
        );

        const leaderboard = await getLeaderboardInfo(gameId, true);

        if (leaderboard) {
          const user = leaderboard?.find((score) => score.user_id === userId);

          const question = user?.answers.find(
            (answer) => answer.question_id === questionId
          );

          if (user && question) {
            user.score += score;
            pool.query(
              "UPDATE game_users SET score = $1 WHERE game_id = $2 AND user_id = $3",
              [user.score, gameId, user.user_id]
            );

            question.answer_id = answerId;
            question.is_correct = isCorrect;

            myCache.set(
              `${gameId}-leaderboard`,
              JSON.stringify(leaderboard),
              cacheTTL
            );

            updateLeaderboard(gameId, true);
          }
        }
      } catch (error) {
        console.log(`Answer error: ${error}`);
      }
    }
  );
};

/**
 * Calculate score based on answer time
 * Under 6 seconds = 10
 * Each second more than 6 subtracts 1 score from the user
 * @param {number} answerTime
 * @returns {number}
 */
export const calculateScore = (answerTime: number): number => {
  let score: number = 0;
  const finishBaseNumber = 16;
  if (answerTime >= 0 && answerTime <= 6) {
    score = 10;
  }

  if (answerTime > 6 && answerTime <= 15) {
    score = finishBaseNumber - answerTime;
  }

  return score;
};

export default handleAnswer;
