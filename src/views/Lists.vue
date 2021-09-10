<template>
  <div class="min-h-screen">
    <h1 class="header">Good morning, {{user.name}}!</h1>
    <Seperator text="Your lists" class="mt-6" />
    <div v-for="(list, index) in lists" class="flex items-center">
      <div v-if="list.item && list.items.length > 0">
        <Bubble :number="list.items.length" class="ml-6" />
      </div>
      <router-link :to="'/list/' + list.id" class="list">{{ list.name }}</router-link>
    </div>
    <!--<Seperator text="Invitations" class="mt-6" />-->
    <div>
      <div class="px-6">
        <button @click="showPopUp = true" class="button float-right">Create list</button>
      </div>
      <InputPopUp v-if="showPopUp" @cancel="showPopUp = false" @confirm="newList" type="text" button="Create list" title="Create list" text="Please enter a name for your new list"/>
    </div>
    <Menu />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createList } from '../appwrite';
import { useStore } from '../store';
import { mapState } from 'pinia';

export default defineComponent({
  name: 'Lists',
  data() {
    return {
      showPopUp: false
    }
  },
  methods: {
    async newList(title: string) {
      await createList(title);
    }
  },
  computed: {
    ...mapState(useStore, ['lists', 'user']),
  },
});
</script>

<style scoped>
.list {
  @apply text ml-2;
}
</style>
