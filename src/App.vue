<template>
  <router-view v-slot="{ Component }" class="background min-h-screen min-w-screen">
    <template v-if="Component">
      <keep-alive>
        <suspense>
          <component :is="Component"></component>
          <template #fallback>
            <div class="background">
              <p class="text">Loading...</p>
            </div>
          </template>
        </suspense>
      </keep-alive>
    </template>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
</style>
