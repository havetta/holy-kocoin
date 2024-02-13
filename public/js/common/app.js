// app.js (shared between server and client)
import { createSSRApp } from "vue";
import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'
import components from "../../datatypes/components.js"

export function createApp(req) {
  //let component = req?.query?.page;
  let component = req?.query?.page;
  if (typeof window === 'object')
  {
    // component = (new URLSearchParams(window?.location?.search)).get('page');
    component = window?.location?.hash?.replace('#/','');
  }
  else {
    console.log(req)
  }

  if (!component)
    component = 'root';

  const app = createSSRApp({ template: `<${component} />` });

  const routes = [{ path: '/', component: components.find(c => c.name === 'root').instance }];
  components.forEach(c => routes.push({path: `/${c.name}`, component: c.instance}) );

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  app.use(router);

  components.forEach(c => app.component(c.name, c.instance) );
  return app;
}
