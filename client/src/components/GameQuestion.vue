<template>
  <!-- Question counter -->
  <div
    class="flex w-20 items-center mx-auto bg-tgSecondaryBackground justify-center py-0.5 px-2 mt-1 rounded-tl-xl rounded-tr-xl"
  >
    <p class="text-tgText text-sm text-center">
      {{ store.questionNumber }} of 10
    </p>
  </div>

  <!-- Question box -->
  <div
    class="flex mb-2 mx-3 py-6 px-3 min-h-[192px] flex-shrink-0 items-center justify-center bg-tgSecondaryBackground rounded-lg md:my-0 md:mx-auto md:w-96"
  >
    <p class="text-base font-semibold text-tgText text-center">
      {{ store.currentQuestion?.text }}
    </p>
  </div>

  <!-- Answer buttons -->
  <button
    v-for="(answer, index) in store.currentQuestion?.answers"
    :key="index"
    class="ripple rounded-md mx-3 mt-2 flex-shrink-0 md:mx-auto md:w-96"
    :class="
      store.answer && store.answer.value?.id === answer.id
        ? store.answer.value?.is_correct
          ? 'bg-green-600'
          : 'bg-red-600'
        : 'bg-tgButton'
    "
    @click="store.answerQuestion(answer)"
  >
    <p class="text-tgButtonText text-sm m-3">
      {{ answer.text }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { useGameStore } from "../stores/gameStore";

const store = useGameStore();
</script>
