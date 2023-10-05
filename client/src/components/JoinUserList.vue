<template>
  <div class="flex flex-col md:my-0 md:mx-auto">
    <div class="flex mt-2 items-center justify-between mx-3 px-1 py-3 md:w-96">
      <div class="flex mr-2">
        <div
          class="flex flex-shrink-0 items-center justify-center rounded-full w-9 h-9 bg-orange-400 ml-3 mr-4"
        >
          <p class="text-sm text-black">{{ props.name.substring(0, 1) }}</p>
        </div>
        <p class="text-sm text-tgText line-clamp-2">
          {{ name }}
        </p>
      </div>
    </div>
    <div class="h-px mx-3 bg-tgSecondaryBackground"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>
