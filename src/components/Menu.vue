<template>
  <div class="menu">
    <div class="spacer"></div>
    <div class="menu-items">
      <div class="menu-item" @click="navigate('/lists')">
        <i-mdi-home class="menu-icon" v-if="route === '/lists'" />
        <i-mdi-home-outline class="menu-icon" v-else />
        <p class="menu-text">Home</p>
      </div>
      <div class="menu-item" @click="navigate('/settings')">
        <i-mdi-cog class="menu-icon" v-if="route === '/settings'"/>
        <i-mdi-cog-outline class="menu-icon" v-else />
        <p class="menu-text">Settings</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Menu',
  setup() {
    const routeObj = useRoute();

    const route = routeObj.path;

    return {
      route,
    }

  },
  watch: {
    $route (to, from) {
      this.route = to.path;
    }
  },
  methods: {
    navigate(link: string) {
      this.$router.push(link);
    },
  },
});
</script>

<style scoped>
.menu {
  @apply fixed bottom-1 w-screen bg-gradient-to-t from-black;
}

.menu-items {
  @apply flex justify-evenly px-8 max-w-lg;
}

.menu-item {
  @apply flex flex-col place-items-center;
}

.menu-icon {
  @apply text-2xl dark:text-white;
}

.menu-text {
  @apply dark:text-white;
}
</style>
