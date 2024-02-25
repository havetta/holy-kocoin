// appshared.js (shared between server and client)
import { createSSRApp, ref } from "vue";

// import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'
import { createRouter, createWebHashHistory, createMemoryHistory } from '../../_npm/vue-router.esm-browser.js'

// import { GButton, GCell, GCellHeader, GFixedBottom, GText } from '../../_npm/@george/core/dist/george-library.js';
// import { createVuetify, components, directives  } from '../../_npm/vuetify.esm.js'



const _micropage = ref('');
const _component = ref('');



const processUrl = (req) => {
  let query = Object.keys(req?.query ?? {})?.[0] ?? '__mxp';
  let hash = new String(query).replace('#/','').split('/');
  let micropage = hash?.[0];
  let component = hash?.[1];

  if (typeof window === 'object')
  {
    hash = new String(window?.location?.search).replace('?','').replace('#/','').split('/');
    if (!hash)
      hash = window?.location?.hash?.replace('#/','').split('/');

    if (hash?.[0])
      micropage = hash?.[0];
    if (hash?.[1])
      component = hash?.[1];
  }

  if (!component)
    component = 'root';
  _micropage.value = micropage;
  _component.value = component;
  console.log(`micropage: ${_micropage.value}`)
  console.log(`component: ${_component.value}`)
};



export async function createApp(req) {
  try {
    processUrl(req);

    const app = createSSRApp({ template: `<${_component?.value} />` });
    let routes = [];

    const componentImports = (await import(`../../${_micropage.value}/_componentImports.js?t=${Date.now()}`)).default;
    if(componentImports) {
      routes = [{ path: '/', component: componentImports?.find(c => c.name === 'root').instance }];
      componentImports?.forEach(c => routes.push({path: `/${_micropage?.value}/${c?.name}`, component: c?.instance}) );
      componentImports?.forEach(c => app.component(c?.name, c?.instance) );
    }
    
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    })
    app.use(router);
    


    // const myAllBlackTheme = {
    //   dark: false,
    //   colors: {
    //     background: "#000000",
    //     surface: "#000000",
    //     primary: "#000000",
    //     "primary-darken-1": "#000000",
    //     secondary: "#000000",
    //     "secondary-darken-1": "#000000",
    //     error: "#000000",
    //     info: "#000000",
    //     success: "#000000",
    //     warning: "#000000",
    //   },
    // };
    // const vuetify = createVuetify({
    //   theme: {
    //     defaultTheme: "myAllBlackTheme",
    //     themes: {
    //       myAllBlackTheme,
    //     },
    //   },
    //   components,
    //   directives,
    // });
    // app.use(vuetify);



    // app.component('GButton', GButton);
    // app.component('GText', GText);

    return app;
  }
  catch(e) {
    console.log(e);
  }
}
