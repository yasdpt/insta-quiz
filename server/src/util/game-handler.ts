import moment from "moment";
import { GameInfo } from "../models/game";
import myCache from "./cache";
import { getCurrentGameInfo, getLeaderboardInfo } from "./game-util";
import pool from "./pool";

const roundDuration = 15000; // in miliseconds
const totalQuestions = 10; // number of questions
const cacheTTL = 30;

const gameLoop = async (
  gameId: number,
  updateGame: (gameId: number, fromCache: boolean) => any,
  updateLeaderboard: (gameId: number, fromCache: boolean) => any
) => {
  let currentQuestionIndex = 0;

  while (currentQuestionIndex <= totalQuestions) {
    try {
      // Question timeout
      await new Promise((resolve) => setTimeout(resolve, roundDuration));

      const gameInfo = (await getCurrentGameInfo(gameId, true)) as GameInfo;

      // Update current question index
      currentQuestionIndex += 1;

      // When index is 10 means last question was asked and
      // a new question will not be sent and the game will end
      if (currentQuestionIndex < 10) {
        // Change question and time started
        const questionAskTime = moment().utc().format();
        gameInfo.current_question = gameInfo.questions[currentQuestionIndex].id;
        gameInfo.question_index = currentQuestionIndex;
        gameInfo.last_question_time = questionAskTime;

        console.log(
          `Question: ${
            gameInfo.current_question
          }, Ask time: ${questionAskTime.toString()}`
        );

        // Update game info in db
        pool.query(
          "UPDATE games SET current_question = $1, last_question_time = $2 WHERE id = $3",
          [gameInfo.current_question, questionAskTime, gameId]
        );
      } else {
        // Set game status to ended
        gameInfo.status = 2;

        // End game info in db
        pool.query("UPDATE games SET status = 2 WHERE id = $1", [gameId]);
      }

      // Update gameInfo in cache
      myCache.set(gameId.toString(), JSON.stringify(gameInfo), cacheTTL);

      // Broadcast game info to all users
      updateGame(gameId, true);
    } catch (error) {
      console.log(`Game loop error: ${error}`);
      continue;
    }
  }
};

export default gameLoop;
