import { createApp, ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './css/common.css'
import App from './App.vue'
import AppRoot from './AppRoot.vue'
import components from '../public/__mxp/_componentImports.js'

// let micropage = (new URLSearchParams(window.location.search)).get('micropage') ?? '__mxp';
// const imp = await import(/* @vite-ignore */`/${micropage}/_componentImports.js?t=${Date.now()}`);
// const components = imp.default;

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
