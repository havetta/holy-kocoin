import { createApp, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './css/common.css'
import App from './App.vue'
import AppRoot from './AppRoot.vue'
import components from "../public/datatypes/components.js"

const routes = [{ path: '/', component: AppRoot }];
components.forEach(c => routes.push({path: `/${c.name}`, component: c.instance}) );
const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App);
components.forEach(c => app.component(c.name, c.instance) );
// app.config.globalProperties.$router = router
app.use(router);
app.mount('#app');
