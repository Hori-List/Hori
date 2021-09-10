import { defineStore } from 'pinia';
import { user, list, invitation } from '../interfaces';
import { getLists } from '../appwrite';


export const useStore = defineStore('main', {
  state() {
    return {
      user: {} as user,
      lists: [] as list[],
      invitations: [] as invitation[],
    };
  },
  actions: {
    async updateLists() {
      this.lists = await getLists();
    },
    async deleteData() {
      this.user = {} as user;
      this.lists = [] as list[];
      this.invitations = [] as invitation[];
    }
  }
});
