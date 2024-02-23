// appshared.js (shared between server and client)
import { createSSRApp, ref } from "vue";
import { createVuetify, components, directives  } from '../../_npm/vuetify.esm.js'

// import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'
import { createRouter, createWebHashHistory, createMemoryHistory } from '../../_npm/vue-router.esm-browser.js'

// import { GButton, GCell, GCellHeader, GFixedBottom, GText } from '@george/core';

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
  console.log(window?.location?.search)
    
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

  const componentImports = (await import(`../../${_microsite.value}/_componentImports.js?t=${Date.now()}`)).default;
  const routes = [{ path: '/', component: componentImports.find(c => c.name === 'root').instance }];
  componentImports.forEach(c => routes.push({path: `/${_microsite.value}/${c.name}`, component: c.instance}) );

  const router = createRouter({
    history: createWebHashHistory(),
    routes,
  })

  const myAllBlackTheme = {
    dark: false,
    colors: {
      background: "#000000",
      surface: "#000000",
      primary: "#000000",
      "primary-darken-1": "#000000",
      secondary: "#000000",
      "secondary-darken-1": "#000000",
      error: "#000000",
      info: "#000000",
      success: "#000000",
      warning: "#000000",
    },
  };
  
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "myAllBlackTheme",
      themes: {
        myAllBlackTheme,
      },
    },
    components,
    directives,
  });
  
  app.use(vuetify);

  componentImports.forEach(c => app.component(c.name, c.instance) );

  app.component('GButton', GButton);
  app.component('GText', GText);

  return app;
}
