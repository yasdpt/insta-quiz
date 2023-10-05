<template>
  <div
    v-if="store.gameInfo?.status !== 1 && store.gameStatus.length !== 0"
    class="flex flex-col my-2 mx-3 py-6 px-3 min-h-[192px] bg-tgSecondaryBackground rounded-lg items-center justify-center md:my-0 md:mx-auto md:w-96"
  >
    <p class="text-base font-semibold text-tgText text-center">
      {{ store.gameStatus }}
    </p>
    <div
      v-if="store.gameInfo?.status === 2"
      class="w-4/5 mx-3 mt-8 md:mx-auto md:w-96"
    >
      <button
        class="ripple bg-tgButton rounded-md w-full"
        @click.prevent="store.closeGame()"
      >
        <Loading class="my-2.5" v-if="store.isStartingGame" />
        <p v-if="!store.isStartingGame" class="text-tgButtonText text-sm m-3">
          Close game
        </p>
      </button>
    </div>
    <div
      v-if="
        store.gameInfo?.status === 0 && store.gameInfo.owner_id === user?.id
      "
      class="w-4/5 mx-3 mt-8 md:mx-auto md:w-96"
    >
      <button
        class="ripple bg-tgButton rounded-md w-full"
        @click.prevent="store.startGame()"
      >
        <Loading class="my-2.5" v-if="store.isStartingGame" />
        <p v-if="!store.isStartingGame" class="text-tgButtonText text-sm m-3">
          Start game
        </p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useGameStore } from "../stores/gameStore";
import Loading from "./Loading.vue";

const webApp = window.Telegram.WebApp;
const user = webApp.initDataUnsafe.user;

const store = useGameStore();

onMounted(() => {
  store.setGameStatusText();
});
</script>
