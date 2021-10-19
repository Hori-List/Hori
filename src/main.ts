import { createApp } from 'vue';
import Vue from './App.vue';
import router from './router';
import { createPinia } from 'pinia'
import 'virtual:windi.css';
import { useStore } from './store';
import {confirmEmail, getInvitations, getLists, getUser, handleRealtime} from './appwrite';
import { App, URLOpenListenerEvent } from '@capacitor/app'

createApp(Vue).use(router).use(createPinia()).mount('#app');
App.addListener('appUrlOpen', async function (event: URLOpenListenerEvent) {
  const url = import.meta.env.VITE_VERIFY_URL;
  const parameterString = event.url.split('?');
  if (!parameterString[1]) { // the app was launched without any parameters or from different domain
    await home();
    return;
  }
  const parameters = parameterString[1].split('&');
  if (!parameters || parameters.length < 3) { // the app was not launched with all the required parameters
    await home();
    return;
  }

  let userId: string = '';
  let secret: string = '';
  parameters.forEach((parameter) => {
    const parts = parameter.split('=');
    if (parts[0] === 'secret') {
      secret = parts[1] as string;
    } else if (parts[0] === 'userId') {
      userId = parts[1] as string;
    }
  });

  if (!userId || !secret) { //one or more parameters are missing
    await home();
    return;
  }

  const confirmation = await confirmEmail(userId, secret);
  home();
  await router.push('/lists');
});

async function home() {
  // set theme
  document.documentElement.classList.add('dark')

  const store = useStore();

  const user = await getUser();
  if (user.id) {
    await store.$patch({ user });
    if (!user.verified) {
      await router.push('/verify');
      return;
    }
    handleRealtime();
    const lists = await getLists();
    const invitations = await getInvitations();
    store.$patch({ lists, invitations });
    router.push('/lists');
  } else {
    router.push('/');
  }
}

home();