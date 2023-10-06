<template>
  <div class="relative container mx-auto">
    <!-- Transition for fade in animation -->
    <transition>
      <!-- Main view -->
      <div
        v-if="!store.failedMsg && !store.isLoading && !socketState.failed"
        class="bg-tgBackground flex flex-col justify-start h-screen p-3 mx-auto"
      >
        <img
          src="/quiz.png"
          alt="InstaQuiz Header Image"
          class="w-52 mt-4 mx-auto"
        />
        <p class="text-2xl text-tgText font-bold mt-2 mx-auto">
          Welcome to Insta Quiz!
        </p>

        <!-- Message based on game state and user id -->
        <p class="text-base text-tgText mt-8 mx-4 max-w-[px] text-center">
          {{ store.joinMsg }}
        </p>

        <div class="mx-9 mt-4 md:mx-auto md:w-96">
          <button
            class="ripple bg-tgButton rounded-md w-full"
            @click.prevent="store.joinGame()"
          >
            <Loading class="my-2.5" v-if="store.isJoining" />
            <p v-if="!store.isJoining" class="text-tgButtonText text-sm m-3">
              {{ store.btnText }}
            </p>
          </button>
        </div>

        <p
          v-if="store.gameInfo?.status != 2"
          class="text-tgText text-xl text-center font-semibold mt-16"
        >
          Users in game
        </p>
        <TransitionGroup
          v-if="store.gameInfo?.status != 2"
          name="list"
          tag="JoinUserList"
        >
          <JoinUserList
            class="mx-5 md:mx-auto md:w-96"
            v-for="(user, index) in store.users"
            :name="user.first_name ?? ''"
            :key="index"
          />
        </TransitionGroup>
      </div>
    </transition>

    <!-- Error views -->
    <div
      v-if="store.failedMsg || socketState.failed"
      class="bg-tgBackground flex flex-col items-center justify-center h-screen p-3 mx-auto"
    >
      <p class="text-tgText text-xl">
        {{
          socketState.failed
            ? "Connection to server failed!"
            : "Failed to get game!"
        }}
      </p>
      <button
        class="bg-tgButton rounded-md p-3 mt-4 w-3/4"
        @click.prevent="store.retry()"
      >
        <p class="text-tgButtonText text-base">Retry</p>
      </button>
    </div>
    <JoinGameLoading :isLoading="store.isLoading && !socketState.failed" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import JoinGameLoading from "../components/JoinGameLoading.vue";
import { useJoinGameStore } from "../stores/joinGameStore";
import Loading from "../components/Loading.vue";
import { socketState } from "../socket";
import { useHomeStore } from "../stores/homeStore";
import JoinUserList from "../components/JoinUserList.vue";

const webApp = window.Telegram.WebApp;

const route = useRoute();

// Init stores
const homeStore = useHomeStore();
const store = useJoinGameStore();

onMounted(() => {
  // Set status ready and expand the page
  webApp.ready();
  webApp.expand();

  // Update user information upon opening the page
  homeStore.upsertUser();

  // Get game id from query parameter "game" and load it
  store.setGameId(route.query.game?.toString() ?? "0");
  store.getGameInfo();
});
</script>
