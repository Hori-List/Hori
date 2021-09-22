<template>
  <div>
    <h1 class="title pt-8">Sign up</h1>
    <form @submit.prevent="" class="form">
      <label class="label">
        Name
        <input type="text" v-model="name" class="input">
      </label>
      <label class="label">
        Email
        <input type="email" v-model="email" class="input">
      </label>
      <label class="label">
        Password
        <input type="password" v-model="password" class="input">
      </label>
      <label class="label">
        Confirm Password
        <input type="password" v-model="confirmPassword" class="input">
      </label>
      <p v-if="error" class="text">{{ error }}</p>
      <button type="submit" @click="signUp" class="button my-4 float-right">Sign up</button>
    </form>
    <div class="absolute bottom-5 inset-x-1/2 min-w-max transform -translate-x-1/2">
      <p class="text text-center">Already have an account?</p>
      <button @click="login" class="button mx-auto text-center">Login</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createAccount, sendVerificationEmail, login } from '../appwrite';
import { useStore } from '../store';

export default defineComponent({
  name: 'SignUp',
  data() {
    return {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      error: '',
    };
  },
  methods: {
    async signUp() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords don\'t match.';
        return;
      }
      if (!this.email || !this.name || !this.password || !this.confirmPassword) {
        this.error = 'All fields have to be filled.';
        return;
      }
      await createAccount(this.email, this.password, this.name).catch((err) => {
        this.error = err.message;
        console.log(err);
      });
      await login(this.email, this.password).catch((err) => {
        console.log(err);
      });
      await sendVerificationEmail().catch((err) => {
        console.error('Could not send verification email.');
        console.log(err);
      });
      await this.$router.push('/verify');
    },
    login() {
      this.$router.push('/login');
    },
  },
});
</script>

<style scoped>
.label {
  @apply mt-4;
}
</style>
