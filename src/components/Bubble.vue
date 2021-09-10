<template>
  <div class="bubble">
    <p class="number">{{ number }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Bubble',
  props: {
    number: Number,
  },
});
</script>

<style scoped>
.bubble {
  @apply w-5 h-5 rounded-full dark:bg-white;
}

.number {
  @apply text text-sm font-regular text-center dark:text-black;
}
</style>
