import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia'
import 'virtual:windi.css';
import { useStore } from './store';
import { getInvitations, getLists, getUser } from './appwrite';

createApp(App).use(router).use(createPinia()).mount('#app');

async function home() {
  // set theme
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }


  const store = useStore();

  const user = await getUser();
  if (user.id) {
    await store.$patch({ user });
    const lists = await getLists();
    const invitations = await getInvitations();
    store.$patch({ lists, invitations });
    router.push('/lists');
  } else {
    router.push('/');
  }
}

home();
