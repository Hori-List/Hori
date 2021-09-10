<template>
  <div class="z-10 px-6 backdrop-filter backdrop-blur backdrop-brightness-50 h-screen w-screen absolute top-0 left-0">
    <div class="transform absolute bottom-0 left-0 w-screen h-70 background shadow-reverse rounded-xl -mb-3 px-6">
      <h1 class="header pt-6 ml-0">{{ title }}</h1>
      <label class="label mt-4">
        {{ text }}
        <input :type="type" class="input mt-2" v-model="name">
      </label>
      <div class="mt-2 flex place-content-between">
        <button class="button" @click="cancel">Cancel</button>
        <button class="button" @click="confirm">{{ button }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConfirmPassword',
  emits: ['cancel', 'confirm'],
  props: {
    title: String,
    text: String,
    button: String,
    type: String,
  },
  data() {
    return {
      name: '',
    };
  },
  methods: {
    confirm() {
      this.$emit('confirm', this.name);
    },
    cancel() {
      this.$emit('cancel');
    },
  },
});
</script>

<style scoped>

</style>
