import { defineStore } from 'pinia';
import { user, list, invitation } from '../interfaces';

export const useStore = defineStore('main', {
  state() {
    return {
      user: {} as user,
      lists: [] as list[],
      invitations: [] as invitation[],
    };
  },
});
