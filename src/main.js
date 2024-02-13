import { createApp, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './css/common.css'
import App from './App.vue'
import AppRoot from './AppRoot.vue'
import components from "../public/js/datatypes/components.js"

const home = { template: '<div>home</div>' }
const conf = { template: '<div>conf</div>' }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: AppRoot },
    { path: '/home', component: home },
    { path: '/conf', component: conf },
    // { path: '/test', component: () => import('/src/component/test.vue')
  ],
})

const app = createApp(App);
components.forEach(c => app.component(c.name, c.instance) );
// app.config.globalProperties.$router = router
app.use(router);
app.mount('#app');
