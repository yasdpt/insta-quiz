<template>
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
          <ChevronDownIcon class="h-5 w-5 text-tgText" aria-hidden="true" />
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
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { useHomeStore } from "../stores/homeStore";

const store = useHomeStore();
</script>
