<template>
  <div>
    <h1 class="title pt-8">Login</h1>
    <form @submit.prevent="" class="form">
      <label class="label">
        Email
        <input type="email" v-model="email" class="input">
      </label>
      <label class="label">
        Password
        <input type="password" v-model="password" class="input">
      </label>
      <p v-if="error" class="text">{{ error }}</p>
      <button type="submit" @click="login" class="button float-right my-4">Login</button>
    </form>
    <div class="absolute bottom-5 inset-x-1/2 min-w-max transform -translate-x-1/2">
      <p class="text text-center">New here?</p>
      <button @click="signUp" class="button">Sign up</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '../store';
import { login, getUser } from '../appwrite';

export default defineComponent({
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    async login() {
      const store = useStore();
      await login(this.email, this.password).catch((err) => {
        this.error = err.message;
      });
      const user = await getUser();
      if (user.id) {
        await store.$patch({ user });
        await store.updateLists();
        await this.$router.push('/lists');
      }
    },
    signUp() {
      this.$router.push('/signup');
    },
  },
});
</script>

<style scoped>
.label {
  @apply mt-4;
}
</style>
