<template>
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
      <p class="text-2xl text-tgText font-bold mt-2">Welcome to Insta Quiz!</p>

      <div
        class="relative w-3/4 mt-8 flex items-center after:w-[8px] after:h-[8px] after:border-tgText after:border-b-2 after:border-r-2 after:transform after:rotate-45 after:absolute after:right-4"
      >
        <!-- Category select menu -->
        <select
          required
          v-model="store.selectedCategory"
          class="text-tgText invalid:text-tgHint bg-tgSecondaryBackground px-5 py-3 transition-all cursor-pointer border-2 border-tgButton focus:border-2 focus:border-tgButton rounded-md outline-tgButton appearance-none w-full"
        >
          <option value="" disabled selected>Select a category</option>
          <option
            v-for="item in store.categories"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <transition>
        <p
          v-if="store.selectCategoryError"
          class="mt-2 -ms-32 text-sm text-red-500 transition-opacity"
        >
          Please select a category!
        </p>
      </transition>
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
    <div class="w-52 h-36 mt-4 rounded-lg bg-tgSecondaryBackground" />
    <div class="w-64 h-7 mt-2 rounded-lg bg-tgSecondaryBackground" />
    <div class="w-3/4 h-12 mt-8 rounded-lg bg-tgSecondaryBackground" />
    <div class="w-3/4 h-12 mt-2 rounded-lg bg-tgSecondaryBackground" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Loading from "../components/Loading.vue";
import { useHomeStore } from "../stores/homeStore";

const webApp = window.Telegram.WebApp;

const store = useHomeStore();

onMounted(() => {
  webApp.ready();
  webApp.expand();
  store.getCategories();
});
</script>
