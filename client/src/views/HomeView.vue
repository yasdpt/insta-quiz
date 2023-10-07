<template>
  <div class="relative container mx-auto">
    <transition>
      <div
        v-if="!store.isLoading"
        class="bg-tgBackground flex flex-col items-center justify-start h-screen p-3 mx-auto"
      >
        <img
          src="/quiz.png"
          alt="InstaQuiz Header Image"
          class="w-52 mt-4"
          width="208px"
        />
        <p class="text-2xl text-tgText font-bold mt-2">
          Welcome to Insta Quiz!
        </p>

        <!-- Custom select box -->
        <HomeSelect />

        <button
          class="bg-tgButton rounded-md p-3 mt-3 w-3/4"
          @click.prevent="store.createGame()"
        >
          <Loading v-if="store.creatingGame" />
          <p v-if="!store.creatingGame" class="text-tgButtonText text-base">
            Create new game
          </p>
        </button>
      </div>
    </transition>
    <div
      v-if="store.failedMsg"
      class="bg-tgBackground flex flex-col items-center justify-center h-screen p-3 mx-auto"
    >
      <p class="text-tgText text-3xl">Failed to get categories!</p>
      <button
        class="bg-tgButton rounded-md p-3 mt-3 w-3/4"
        @click.prevent="store.retry()"
      >
        <p class="text-tgButtonText text-base">Retry</p>
      </button>
    </div>
    <div
      v-if="store.isLoading"
      class="bg-tgBackground flex flex-col animate-pulse items-center justify-start h-screen p-3 mx-auto"
    >
      <div
        class="w-52 h-36 mt-4 shrink-0 rounded-lg bg-tgSecondaryBackground"
      />
      <div class="w-64 h-7 mt-2 shrink-0 rounded-lg bg-tgSecondaryBackground" />
      <div
        class="w-32 h-6 -ms-36 mt-12 shrink-0 rounded-lg bg-tgSecondaryBackground"
      />
      <div
        class="w-3/4 h-12 mt-2 shrink-0 rounded-lg bg-tgSecondaryBackground"
      />
      <div
        class="w-3/4 h-12 mt-2 shrink-0 rounded-lg bg-tgSecondaryBackground"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Loading from "../components/Loading.vue";
import { useHomeStore } from "../stores/homeStore";
import HomeSelect from "../components/HomeSelect.vue";

const webApp = window.Telegram.WebApp;

const store = useHomeStore();

onMounted(() => {
  webApp.ready();
  webApp.expand();
  store.getCategories();
});
</script>
