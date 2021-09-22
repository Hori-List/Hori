<template>
  <div>
    <h1 class="name py-2">{{ list.name }}</h1>
    <div v-if="list.items">
      <div v-for="(item, index) in list.items" class="px-6" :key="index">
        <p class="item" @click="removeItem(item)" :key="item">{{ item }}</p>
      </div>
    </div>
    <div v-else class="ml-6 mt-2">
      <p class="text">There are no items on this list.</p>
    </div>

    <div class="add">
      <input :disabled="disabled" type="text" autocapitalize="words" v-model="newItem" @keyup.enter="addItem" class="input" placeholder="Add an item">
      <i-mdi-send class="icon" @click="addItem" :disabled="disabled"/>
    </div>
    <Menu/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '../store';
import { useRoute } from 'vue-router';
import { addItem, getLists, removeItem } from '../appwrite';
import { list } from '../interfaces';

export default defineComponent({
  name: 'List',
  data() {
    return {
      newItem: '',
      disabled: false
    };
  },
  methods: {
    async addItem() {
      this.disabled = true;
      const store = useStore();

      const listId = this.id as string;
      await addItem(listId, this.newItem);
      store.updateLists();
      this.newItem = '';
      this.disabled = false;
    },
    async removeItem(item: string) {
      const store = useStore();
      await removeItem(this.id as string, item);
      store.updateLists();
    },
  },
  async setup() {
    const route = useRoute();
    const store = useStore();

    const { id } = route.params;

    const list = computed(() => store.lists.find(list => list.id === id) as list);

    return {
      id,
      list,
    };
  },
});
</script>

<style scoped>
.name {
  @apply title
}

.add {
  @apply fixed bottom-18 flex px-6;
}

.icon {
  @apply text-white text-4xl ml-4;
}

.item {
  @apply text;
}
</style>
