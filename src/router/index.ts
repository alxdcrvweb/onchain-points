/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router';
import index from '../pages/index.vue';
import top from '../pages/top.vue';
import topByLeague from '../pages/topInd.vue';
import squad from '../pages/squad.vue';
import boost from '../pages/boost.vue';
import boost2 from '../pages/boost2.vue';
import referralVue from '@/pages/referral.vue';
const routes = [
    {
        path: '/',
        name: 'index',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: index
    },
    {
        path: '/top',
        name: 'League',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: topByLeague
    },
    {
        path: '/squad',
        name: 'squad',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: squad
    },
    { path: '/league', name: 'league', component: topByLeague },
    { path: '/boost', name: 'boost', component: boost },
    { path: '/boost2', name: 'boost2', component: boost2 },
  { path: '/referral', name: 'referral', component: referralVue },
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;
