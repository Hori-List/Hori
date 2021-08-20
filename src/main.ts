import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import 'virtual:windi.css';

// set environment variables
require('dotenv').config();

createApp(App).use(router).use(store).mount('#app');
