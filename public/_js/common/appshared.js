// appshared.js (shared between server and client)
import { createSSRApp, ref } from "vue";
import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'

const _microsite = ref('');
const _component = ref('');



const processUrl = (req) => {
  let query = Object.keys(req?.query ?? {})?.[0] ?? '__mxp';
  let hash = new String(query).replace('#/','').split('/');
  let microsite = hash?.[0];
  let component = hash?.[1];

  if (typeof window === 'object')
  {
    hash = new String(window?.location?.search).replace('?','').replace('#/','').split('/');
    if (!hash)
      hash = window?.location?.hash?.replace('#/','').split('/');

    if (hash?.[0])
      microsite = hash?.[0];
    if (hash?.[1])
      component = hash?.[1];
  }

  if (!component)
    component = 'root';

  _microsite.value = microsite;
  _component.value = component;
};



export async function createApp(req) {
  processUrl(req);

  const app = createSSRApp({ template: `<${_component.value} />` });
  console.log(`microsite: ${_microsite.value}`)
  console.log(`component: ${_component.value}`)

  const components = (await import(`../../${_microsite.value}/_componentImports.js?t=${Date.now()}`)).default;
  const routes = [{ path: '/', component: components.find(c => c.name === 'root').instance }];
  components.forEach(c => routes.push({path: `/${_microsite.value}/${c.name}`, component: c.instance}) );

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  app.use(router);

  components.forEach(c => app.component(c.name, c.instance) );
  return app;
}
