import { defineStore } from "pinia";
import { Ref, ref } from "vue";
import api from "../configs/axiosConfigs";

export const useHomeStore = defineStore("home", () => {
  const webApp = window.Telegram.WebApp;
  const user = webApp.initDataUnsafe.user;

  const categories: Ref<Category[]> = ref([]);
  const selectedCategory = ref("");
  const isLoading = ref(true);
  const creatingGame = ref(false);
  const selectCategoryError = ref(false);
  const failedMsg = ref("");

  function retry() {
    isLoading.value = true;
    getCategories();
    upsertUser();
  }

  // Update user information
  async function upsertUser() {
    const response = await api.request({
      url: "/users/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        id: user?.id,
        first_name: user?.first_name,
        last_name: user?.last_name,
        username: user?.username,
        is_bot: user?.is_bot,
        language_code: user?.language_code,
        is_premium: user?.is_premium,
        added_to_attachment_menu: user?.added_to_attachment_menu,
        allows_write_to_pm: user?.allows_write_to_pm,
        photo_url: user?.photo_url,
      }),
    });

    if (response.status !== 201) {
      failedMsg.value = "Failed to retreive data, try again!";
    }
  }
  async function getCategories() {
    const response = await api.request({
      url: "/categories",
      method: "GET",
    });

    isLoading.value = false;

    if (response.status === 500) {
      return;
    }

    if (response.status === 200) {
      categories.value = response.data;
    }
  }

  async function createGame() {
    if (creatingGame.value) {
      return;
    }

    if (selectedCategory.value === "") {
      selectCategoryError.value = true;
      return;
    }

    selectCategoryError.value = false;

    if (!user?.allows_write_to_pm) {
      webApp.showAlert("To create a new game first start the bot!", () => {
        webApp.close();
      });
      return;
    }

    creatingGame.value = true;

    const response = await api.request({
      url: "/games/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        userId: user?.id,
        categoryId: selectedCategory.value,
        webAppQuery: webApp.initDataUnsafe.query_id,
      }),
    });
    creatingGame.value = false;
    if (response.status === 201) {
      webApp.showPopup(
        {
          title: "Game created",
          message:
            "You will receive a message in the bot and can forward it your friends to start playing!",
          buttons: [{ type: "default", text: "Go to chat" }],
        },
        () => {
          webApp.close();
        }
      );
    }

    if (response.status === 200) {
      webApp.showPopup(
        {
          title: "Failed to create game!",
          message:
            "You have already created a game, forward it to your friends and start playing!",
          buttons: [{ type: "default", text: "Go to chat" }],
        },
        () => {
          webApp.close();
        }
      );
    }

    if (response.status === 500) {
      webApp.showAlert("Failed to create the game, try again later!");
    }
  }

  return {
    categories,
    selectedCategory,
    isLoading,
    selectCategoryError,
    creatingGame,
    failedMsg,
    retry,
    getCategories,
    upsertUser,
    createGame,
  };
});
