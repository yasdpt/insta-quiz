<template>
  <transition>
    <div class="relative container mx-auto">
      <div
        v-if="!store.isLoading"
        class="bg-tgBackground flex flex-col justify-start h-screen p-3 mx-auto"
      >
        <!-- Header image and welcome -->
        <AppHeader />

        <!-- Custom select box -->
        <HomeSelect />

        <button
          class="ripple bg-tgButton rounded-md mx-9 mt-3 md:mx-auto md:w-96"
          @click.prevent="store.createGame()"
        >
          <Loading class="my-3" v-if="store.creatingGame" />
          <p v-if="!store.creatingGame" class="text-tgButtonText text-sm m-3.5">
            Create new game
          </p>
        </button>
      </div>
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
        <div
          class="w-64 h-7 mt-2 shrink-0 rounded-lg bg-tgSecondaryBackground"
        />
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
  </transition>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Loading from "../components/Loading.vue";
import { useHomeStore } from "../stores/homeStore";
import HomeSelect from "../components/HomeSelect.vue";
import AppHeader from "../components/AppHeader.vue";

const webApp = window.Telegram.WebApp;

const store = useHomeStore();

onMounted(() => {
  webApp.ready();
  webApp.expand();
  store.upsertUser();
  store.getCategories();
});
</script>
