import { socket } from "../configs/socketConfigs";
import { defineStore } from "pinia";
import { Ref, computed, ref } from "vue";
import api from "../configs/axiosConfigs";
import { useGameStore } from "./gameStore";
import { useRouter } from "vue-router";

export const useJoinGameStore = defineStore("joinGameStore", () => {
  const webApp = window.Telegram.WebApp;
  const user = webApp.initDataUnsafe.user;

  const router = useRouter();

  let gameId: string = "";

  const isLoading = ref(true);
  const isJoining = ref(false);
  const joinMsg = ref("");
  const btnText = ref("");
  const failedMsg = ref("");

  const users: Ref<WaitListUser[] | undefined> = ref([]);
  const leaderboard: Ref<Leaderboard[] | undefined> = ref([]);
  const gameInfo: Ref<Game | undefined> = ref();

  const isGameEnded = computed(() => gameInfo.value?.status === 2);
  const listMode = computed(() =>
    gameInfo.value?.status === 2 ? "Results" : "Users in game"
  );

  socket.on("updateWaitList", (waiList) => {
    if (waiList) {
      users.value = waiList;
    }
  });

  function setGameId(gId: string) {
    gameId = gId;
  }

  function retry() {
    failedMsg.value = "";
    isLoading.value = true;
    getGameInfo();
  }

  async function getGameInfo() {
    try {
      const response = await api.request({
        url: `/games/${gameId}`,
        method: "GET",
      });

      isLoading.value = false;

      if (response.status === 200) {
        gameInfo.value = response.data;

        socket.emit(
          "getWaitList",
          gameInfo.value?.id,
          gameInfo.value?.status,
          (response: any) => {
            if (response.status === 200) {
              users.value = response.waitList;
            }

            if (response.status === 226) {
              leaderboard.value = response.leaderboard.sort(
                (a: Leaderboard, b: Leaderboard) => b.score - a.score
              );
            }
          }
        );
        // Set ui texts
        setUiMessages();
      }
    } catch (error) {
      isLoading.value = false;
      failedMsg.value = "Failed to get game info!";
    }
  }

  // Join the game
  function joinGame() {
    if (gameInfo.value?.status == 2) {
      webApp.close();
      return;
    }

    isJoining.value = true;
    const gameStore = useGameStore();
    // Join game via socket
    socket.emit("joinGame", user?.id, gameId, (response: any) => {
      isJoining.value = false;
      // Check response status and if an error happened show a popup.
      if (response && response.status == 200) {
        // If status is 200 fill gameStore gameInfo and leaderboard
        // and push to game view.
        gameStore.gameInfo = response.game;
        gameStore.leaderboard = response.leaderboard;
        // console.log(response.leaderboard);
        router.replace("/game");
      } else {
        webApp.showPopup(
          {
            title: "Failed to join game",
            message: response.message,
            buttons: [{ type: "close" }],
          },
          () => {
            webApp.close();
          }
        );
      }
    });
  }

  // Set what's shown on the screen based on owner_id and status of the game
  function setUiMessages() {
    if (gameInfo.value?.owner_id === user?.id && gameInfo.value?.status === 0) {
      joinMsg.value = `Hello ${gameInfo.value?.user_first_name}, You can start the game right now!`;
      btnText.value = "View game";
      return;
    }

    if (gameInfo.value?.status === 1) {
      joinMsg.value = "You can still rejoin the game if you were on the list!";
      btnText.value = "Rejoin game";
      return;
    }

    if (gameInfo.value?.status === 2) {
      joinMsg.value =
        "Unfortunately the game has ended, you can create a new game in InstaQuiz's bot!";
      btnText.value = "Close";
      return;
    }

    joinMsg.value = `Join ${gameInfo.value?.user_first_name} in a quiz of "${gameInfo.value?.category_name}" category!`;
    btnText.value = "Join game";
  }

  return {
    users,
    isLoading,
    isJoining,
    joinMsg,
    btnText,
    failedMsg,
    gameInfo,
    leaderboard,
    isGameEnded,
    listMode,
    setGameId,
    retry,
    getGameInfo,
    joinGame,
    setUiMessages,
  };
});
