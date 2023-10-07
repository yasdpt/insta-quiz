<template>
  <div class="flex flex-col md:my-0 md:mx-auto">
    <div class="flex mt-2 items-center justify-between mx-3 px-1 py-3 md:w-96">
      <!-- Name color icon and name -->
      <div class="flex mr-2">
        <!-- Name colored circle -->
        <div
          class="flex flex-shrink-0 items-center justify-center rounded-full w-9 h-9 ml-3 mr-4"
          :class="color"
        >
          <p class="text-sm text-white">{{ name.substring(0, 1) }}</p>
        </div>
        <!-- Name -->
        <p class="text-sm text-tgText line-clamp-2">
          {{ name }}
        </p>
      </div>

      <!-- Answer circles and score -->
      <div class="flex items-center flex-shrink-0">
        <!-- Circles container -->
        <div class="grid grid-cols-5 grid-rows-2 gap-1">
          <div
            v-for="(answer, index) in user?.answers"
            :key="index"
            class="rounded-full w-4 h-4"
            :class="
              answer.answer_id
                ? answer.is_correct
                  ? 'bg-green-600'
                  : 'bg-red-600'
                : 'bg-tgHint opacity-30'
            "
          ></div>
        </div>
        <!-- Divider -->
        <div class="w-px h-9 bg-tgSecondaryBackground ml-4" />
        <!-- Score -->
        <div class="flex items-center justify-center w-10">
          <p class="text-sm text-tgText">{{ score }}</p>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px mx-3 bg-tgSecondaryBackground" />
  </div>
</template>

<script setup lang="ts">
import { getColor } from "../configs/colorConfigs";

const color = getColor();

defineProps<{
  name: string;
  score?: number;
  user?: Leaderboard;
}>();
</script>
