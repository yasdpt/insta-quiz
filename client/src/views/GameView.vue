<template>
  <div class="relative container mx-auto">
    <Transition name="card">
      <div
        class="bg-tgBackground flex flex-col justify-start h-screen p-3 mx-auto"
      >
        <GameQuestion v-if="store.gameIsRunning" />

        <GameInfo v-if="!store.gameIsRunning" />

        <p class="text-tgText text-xl text-center font-semibold mt-8">
          Leaderboard
        </p>
        <TransitionGroup name="list" tag="GameScore">
          <GameScore
            class="mx-2 md:mx-auto md:w-96"
            v-for="(user, index) in store.leaderboard"
            :key="index"
            :name="`${user.first_name} ${user.last_name}`"
            :score="user.score"
            :user="user"
          />
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import GameScore from "../components/GameScore.vue";
import GameQuestion from "../components/GameQuestion.vue";
import { useGameStore } from "../stores/gameStore";
import GameInfo from "../components/GameInfo.vue";

const webApp = window.Telegram.WebApp;

const store = useGameStore();

onMounted(() => {
  webApp.expand();
});
</script>
