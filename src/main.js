import { createApp, ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './css/common.css'
import App from './App.vue'
import AppRoot from './AppRoot.vue'

let microsite = (new URLSearchParams(window.location.search)).get('microsite');
if (!microsite)
  microsite = 'mxp';
const importname = `/datatypes/${microsite}/__generated!__.js?t=${Date.now()}`;
const imp = await import(/* @vite-ignore */importname);
const components = imp.default;

const routes = [{ path: '/', component: AppRoot }];
components.forEach(c => routes.push({path: `/${c.name}`, component: c.instance}) );
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App);
components.forEach(c => app.component(c.name, c.instance) );
// app.config.globalProperties.$router = router
app.use(router);
app.mount('#app');
