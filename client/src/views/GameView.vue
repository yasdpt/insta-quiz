<template>
  <div class="relative container mx-auto">
    <div
      class="bg-tgBackground flex flex-col justify-start h-screen p-3 mx-auto"
    >
      <Transition name="card">
        <GameQuestion v-if="store.gameIsRunning" />
        <GameInfo v-if="!store.gameIsRunning" />
      </Transition>

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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import GameScore from "../components/GameScore.vue";
import GameQuestion from "../components/GameQuestion.vue";
import { useGameStore } from "../stores/gameStore";
import GameInfo from "../components/GameInfo.vue";

const webApp = window.Telegram.WebApp;

const router = useRouter();
const store = useGameStore();

onMounted(() => {
  webApp.expand();
});

const game = ref("");

game.value = router.currentRoute.value.query.name?.toString() || "N/A";
</script>
