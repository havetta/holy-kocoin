// appshared.js (shared between server and client)
import { createSSRApp } from "vue";
import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'

export async function createApp(req) {
  let microsite = req?.query?.page ?? '__mxp';
  if (typeof window === 'object')
    microsite = (new URLSearchParams(window?.location?.search))?.get('microsite') ?? '__mxp';
  const components = (await import(`../../datatypes/${microsite}/__generated.js?t=${Date.now()}`)).default;

  let component = req?.query?.page ?? 'root';
  if (typeof window === 'object')
  {
    component = (new URLSearchParams(window?.location?.search)).get('page');
    if (!component)
      component = window?.location?.hash?.replace('#/','');
    if (!component)
      component = 'root';
  }

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
