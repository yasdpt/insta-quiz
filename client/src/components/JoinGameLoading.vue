<template>
  <!-- Loading shimmer effect with animate-pulse class from tailwindcss -->
  <div
    v-if="isLoading"
    class="bg-tgBackground flex-col animate-pulse justify-start h-screen p-3 mx-auto"
    :class="isLoading ? 'flex' : 'hide'"
  >
    <div
      class="w-52 h-36 flex-shrink-0 mt-4 mx-auto rounded-lg bg-tgSecondaryBackground"
    />
    <div
      class="w-64 h-7 mt-2 flex-shrink-0 mx-9 md:mx-auto self-center rounded-lg bg-tgSecondaryBackground"
    />
    <div
      class="h-7 mt-8 mx-9 flex-shrink-0 md:mx-auto md:w-96 rounded-lg bg-tgSecondaryBackground"
    />
    <div
      class="h-12 mt-4 mx-9 flex-shrink-0 md:mx-auto md:w-96 rounded-lg bg-tgSecondaryBackground"
    />
    <div
      class="w-36 h-7 mt-16 flex-shrink-0 mx-9 md:mx-auto self-center rounded-lg bg-tgSecondaryBackground"
    />

    <div class="flex mx-9 flex-shrink-0 mt-2 md:my-0 md:mx-auto">
      <div
        class="flex justify-center rounded-full w-9 h-9 bg-tgSecondaryBackground ml-3 mr-4 mt-4"
      />
      <div
        class="w-28 h-4 mt-2 md:mx-auto self-center rounded-lg bg-tgSecondaryBackground"
      />
    </div>

    <div class="flex mx-9 md:my-0 md:mx-auto">
      <div
        class="flex justify-center rounded-full w-9 h-9 bg-tgSecondaryBackground ml-3 mr-4 mt-4"
      />
      <div
        class="w-28 h-4 mt-2 md:mx-auto self-center rounded-lg bg-tgSecondaryBackground"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(["isLoading"]);
</script>
