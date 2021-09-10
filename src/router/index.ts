import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue'),
  },
  {
    path: '/lists',
    name: 'Lists',
    component: () => import('../views/Lists.vue'),
  },
  {
    path: '/list/:id',
    name: 'List',
    component: () => import('../views/List.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
