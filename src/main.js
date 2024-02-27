import { createApp, ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './css/common.css'
import App from './App.vue'
import AppRoot from './AppRoot.vue'
import micropageList from '../public/componentList.js'

const routes = [{ path: '/', component: AppRoot }];
micropageList.forEach((pg) => {
  pg.componentList.forEach((c) => routes.push({path: `${pg.shortpgname}/${c.shortname}`, component: c.instance}) );
});
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App);
app.use(router);
// app.config.globalProperties.$router = router

const allComponents = [];
micropageList.forEach((pg) => {
  let uniqueName = c.shortname;
  if (allComponents.includes(c.shortname))
    uniqueName = `${pg.shortname}-${c.shortname}`;
  componentList.forEach((c) => app.component(uniqueName, c.instance) );
  allComponents.push(c.shortname);
});

app.mount('#app');
