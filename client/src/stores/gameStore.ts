import { defineStore } from "pinia";
import { Ref, computed, ref } from "vue";
import { socket } from "../configs/socketConfigs";

export const useGameStore = defineStore("game", () => {
  // Get Telegram object from window
  const webApp = window.Telegram.WebApp;
  const user = webApp.initDataUnsafe.user;

  const gameInfo: Ref<GameInfo | undefined> = ref();
  const leaderboard: Ref<Leaderboard[] | undefined> = ref();

  const gameStatus = ref("");
  // For preventing user from sending multiple answers
  let answered = false;
  const currentAnswer: Ref<Answer | undefined> = ref();
  const isStartingGame = ref(false);

  const gameIsRunning = computed(() => gameInfo.value?.status === 1);

  const currentQuestion = computed(() =>
    gameInfo.value?.questions.find(
      (question) => question.id === gameInfo.value?.current_question
    )
  );

  const questionNumber = computed(
    () => (gameInfo.value?.question_index ?? 0) + 1
  );

  // Return the answer of the user for current question to change
  // answer button color.
  const answer = computed(() => {
    if (
      currentAnswer.value &&
      currentQuestion.value?.answers.includes(currentAnswer.value!)
    ) {
      return currentAnswer;
    }

    return undefined;
  });

  // Listen to updateGame socket event to update gameStatus and current question
  socket.on("updateGame", (gInfo) => {
    if (gInfo) {
      answered = false;
      gameInfo.value = gInfo;
      if (gameInfo.value?.status === 2) {
        setGameStatusText();
      }
    }
  });

  // Listen to updateLeaderboard socket event
  socket.on("updateLeaderboard", (lb: Leaderboard[]) => {
    if (lb) {
      // Sort leaderboard based on user scores before assigning
      leaderboard.value = lb.sort((a, b) => b.score - a.score);
    }
  });

  // emit startGame event to server
  function startGame() {
    isStartingGame.value = true;
    socket.emit("startGame", user?.id, gameInfo.value?.id, (response: any) => {
      isStartingGame.value = false;
      if (response && response.status === 200) {
        gameInfo.value = response.game;
        leaderboard.value = response.leaderboard;
      } else {
        webApp.showPopup({
          title: "Failed",
          message: response.message ?? "Failed to start game",
          buttons: [{ type: "default", text: "Back" }],
        });
      }
    });
  }

  // Update gameStatus text based on gameInfo
  function setGameStatusText() {
    if (gameInfo.value?.status === 0) {
      gameStatus.value = `Game has not started yet, ${
        gameInfo.value?.owner_id === user?.id
          ? "click button below to start it"
          : "please wait till it starts"
      }!`;
    }

    if (gameInfo.value?.status === 2) {
      gameStatus.value = `Game has ended, check scores below!`;
    }
  }

  // emit gameAnswer event to server
  function answerQuestion(answer: Answer) {
    if (!answered) {
      answered = true;
      currentAnswer.value = answer;
      socket.emit(
        "gameAnswer",
        gameInfo.value?.id,
        user?.id,
        currentQuestion.value?.id,
        answer.id,
        answer.is_correct
      );
    }
  }

  function closeGame() {
    webApp.close();
  }

  return {
    gameInfo,
    leaderboard,
    gameStatus,
    gameIsRunning,
    isStartingGame,
    currentQuestion,
    answer,
    questionNumber,
    setGameStatusText,
    startGame,
    answerQuestion,
    closeGame,
  };
});
