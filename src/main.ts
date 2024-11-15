/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins';
import WebApp from '@twa-dev/sdk';
import VueGtag from 'vue-gtag';
import router from "@/router";
import { createApp } from 'vue';

// Components
import App from './App.vue';
WebApp.ready();
// Composables

const app = createApp(App);
// export const socketWR = new SocketWrapper();
app.use(
  VueGtag, {
    appName: 'ChainGame',
    pageTrackerScreenviewEnabled: true,
    config: { id: 'G-Z6Z992LEQC' },
  },
  router
)
registerPlugins(app);

app.mount('#app');

console.log('Vite env', import.meta.env); // import.meta.env
