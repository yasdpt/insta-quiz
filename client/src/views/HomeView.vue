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
        <Listbox v-model="store.selectedCategory">
          <div class="relative w-3/4 mt-8">
            <ListboxLabel class="text-tgText text-base font-bold ms-2"
              >Select a category</ListboxLabel
            >
            <ListboxButton
              class="text-tgText mt-2 invalid:text-tgText text-left bg-tgSecondaryBackground px-5 h-[50px] cursor-pointer border-2 border-tgButton focus:border-2 focus:border-tgButton rounded-md outline-tgButton w-full"
            >
              <span class="block truncate text-tgText">{{
                store.selectedCategory?.name
              }}</span>
              <span
                class="pointer-events-none absolute inset-y-0 right-0 top-8 flex items-center pr-2"
              >
                <ChevronDownIcon
                  class="h-5 w-5 text-tgText"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions
                class="absolute mt-1 max-h-48 w-full overflow-auto rounded-md bg-tgSecondaryBackground py-1 text-base sm:text-sm"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="category in store.categories"
                  :key="category.name"
                  :value="category"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-tgHint text-tgText' : 'text-tgText',
                      'relative cursor-default select-none py-2 pl-6',
                    ]"
                  >
                    <span
                      :class="[
                        selected ? 'font-medium' : 'font-normal',
                        'block truncate',
                      ]"
                      >{{ category.name }}</span
                    >
                    <span
                      v-if="selected"
                      class="absolute inset-y-0 left-0 flex items-center"
                    >
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
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
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const webApp = window.Telegram.WebApp;

const store = useHomeStore();

onMounted(() => {
  webApp.ready();
  webApp.expand();
  store.getCategories();
});
</script>
