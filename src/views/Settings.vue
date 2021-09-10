<template>
  <div>
    <h1 class="header">Settings</h1>
    <Seperator text="Account" class="mt-6 mb-2" />
    <label class="label px-6">
      Name
      <input type="text" v-model="name" class="input" >
    </label>
    <div class="px-6 mb-14">
      <button class="button float-right my-2" @click="changeName" :disabled="name === user.name">Save</button>
    </div>
    <label class="label px-6 mt-2">
      Email
      <input type="email" v-model="email" class="input">
    </label>
    <div class="px-6">
      <button class="button float-right mt-2" @click="popUpOpen = true" :disabled="email === user.email">Save</button>
      <InputPopUp v-model="confirmPassword" v-if="popUpOpen" title="Authentication required" text="Please enter your password to change your email" type="password" button="Change email" @cancel="popUpOpen = false" @confirm="changeEmail" />
    </div>
    <Seperator text="App" class="mt-6 mb-2" />
    <button @click="signOut" class="button ml-6">Sign out</button>
    <Menu />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '../store';
import { logout, updateEmail, updateName } from '../appwrite';
import { mapState } from 'pinia';

export default defineComponent({
  name: 'Profile',
  data() {
    return {
      popUpOpen: false,
      confirmPassword: '',
      email: '',
      name: '',
    };
  },
  beforeMount() {
    this.email = this.user.email;
    this.name = this.user.name;
    console.log("yes settings")
  },
  methods: {
    signOut() {
      const store = useStore();
      store.deleteData();
      logout();
      this.$router.push('/login');
    },
    async changeEmail(password: string) {
      const res = await updateEmail(this.email, password);
      console.log(res);
    },
    async changeName() {
      const res = await updateName(this.name);
      console.log(res);
    }
  },
  computed: {
    ...mapState(useStore, ['user']),
  },
});
</script>

<style scoped>

</style>
