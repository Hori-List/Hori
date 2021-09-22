<template>
  <div>
    <div class="message">
      <p class="text text-center w-screen">Please verify your email</p>
    </div>
    <img src="../assets/undraw/mailbox.svg" alt="" class="max-w-1/2 h-auto m-x-auto my-12">
    <div class="px-6">
      <h1 class="title mb-2">Welcome, {{ user.name }}!</h1>
      <p class="text">To start using Hori, you'll need to confirm your email address.</p>
      <p class="text">You should've already received an email from us containing a link. Just follow that link to get
        started.</p>
    </div>
    <div class="absolute bottom-5 inset-x-1/2 w-max transform -translate-x-1/2 flex flex-col">
      <p class="text">Haven't received the email?</p>
      <button class="button max-w-max m-x-auto mt-2" @click="resendEmail" :disabled="disabled">Send again <span
          v-if="remaining">({{ remaining }})</span></button>
      <button @click="logOut">Log out</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useStore} from "../store";
import {computed} from "vue";
import {sendVerificationEmail, logout} from "../appwrite";
import {ref} from 'vue'
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const user = computed(() => store.user);

let lastSend = new Date(0);


const remaining = ref<string>('');
const disabled = ref<boolean>(false);
const cooldown = 10 * 60000;

const timer = setInterval(() => {
  if (!lastSend) {
    disabled.value = false;
    remaining.value = '';
    return;
  }
  const curr = new Date();
  if (lastSend.getTime() < curr.getTime() - cooldown) {
    disabled.value = false;
    remaining.value = '';
    return;
  }
  const diff = lastSend.getTime() - (curr.getTime() - cooldown);
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  remaining.value = `${minutes}:${seconds}`;
}, 1000);

function resendEmail() {
  disabled.value = true;
  const curr = new Date();
  if (lastSend && lastSend.getTime() < curr.getTime() - cooldown) {
    sendVerificationEmail();
    lastSend = curr;
  }
}

async function logOut() {
  await logout();
  store.deleteData();
  await router.push('/');
}

</script>

<style scoped>
.message {
  @apply w-screen h-10 bg-red-500 flex place-items-center justify-items-center;
}
</style>