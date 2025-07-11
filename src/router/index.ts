/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router';
import index from '../pages/index.vue';
import firstGame from '../pages/firstGame.vue';
import banger from '@/pages/banger.vue';
import tasks from "@/pages/tasks.vue"
const routes = [
    { path: '/', name: 'index', component: index },
    { path: '/firstGame', name: 'firstGame', component: firstGame },
    { path: '/banger', name: 'banger', component: banger },
    { path: '/tasks', name: 'tasks', component: tasks }
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
