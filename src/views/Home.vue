<template>
  <div class="px-6 h-screen">
    <img src="../assets/logo.png" alt="Logo" class="w-2/3 max-w-sm mx-auto pt-4">
    <h1 class="title py-4">Welcome to Hori</h1>
    <p class="text">The simple App for all your shopping list needs.</p>
    <div class="flex flex-col px-1/6 absolute bottom-5">
      <p class="text text-center">New here?</p>
      <button class="button bg-purple-500" @click="navigate('/signup')">Sign up</button>
      <p class="text mt-2 text-center">Already have an account?</p>
      <button class="button" @click="navigate('/login')">Log in</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function navigate(route: string) {
  router.push(route);
}
</script>


<style scoped>
</style>
