import { createApp, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './css/common.css'
import App from './App.vue'
import test from './components/test.vue'
import components from "./datatypes/components.js"
import state from "./datatypes/state"

const home = { template: '<div>home</div>' }
const conf = { template: '<div>conf</div>' }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: App },
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