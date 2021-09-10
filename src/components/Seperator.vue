<template>
  <div class="w-screen flex items-center px-6">
    <div class="w-1/8 line"></div>
    <p class="seperator-text">{{ text }}</p>
    <div class="w-full line"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Seperator',
  props: {
    text: String,
  },
});
</script>

<style scoped>
.line {
  @apply h-px dark:bg-white;
}

.seperator-text {
  @apply text font-normal text-base mx-3 min-w-max;
}
</style>
