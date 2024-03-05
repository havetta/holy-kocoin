import { createSSRApp, ref } from 'vue';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
} from '../../_npm/vue-router.esm-browser.js';
// import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'

// import { GButton, GCell, GCellHeader, GFixedBottom, GText } from '../../_npm/@george/core/dist/george-library.js';
// import { createVuetify, components, directives  } from '../../_npm/vuetify.esm.js'

//TODO /////////////////////////////////////////////////////////
//TODO   processUrl  ///////////////////////////////////////////
//TODO /////////////////////////////////////////////////////////
const _page = ref('');
const _section = ref('');

const processUrl = (req) => {
  let query = Object.keys(req?.query ?? {})?.[0] ?? '__mxp';
  let hash = new String(query).replace('#/', '').split('/');
  let page = hash?.[0];
  let section = hash?.[1];

  if (typeof window === 'object') {
    hash = new String(window?.location?.search)
      .replace('?', '')
      .replace('#/', '')
      .split('/');
    if (!hash) hash = window?.location?.hash?.replace('#/', '').split('/');

    if (hash?.[0]) page = hash?.[0];
    if (hash?.[1]) section = hash?.[1];
  }

  if (!section) section = 'home';
  _page.value = page === '' ? '__mxp' : page ?? '__mxp';
  _section.value = section === '' ? 'home' : section  ?? 'home';
  console.log(`page: ${_page.value}`);
  console.log(`section: ${_section.value}`);
};


//TODO /////////////////////////////////////////////////////////
//TODO   createApp  ////////////////////////////////////////////
//TODO /////////////////////////////////////////////////////////
export async function createApp(req) {
  try {
    processUrl(req);

    const app = createSSRApp({ template: `<${_section?.value} />` });
    let routes = [];

    const sectionImports = (await import(`../../${_page.value}/_sectionImports.js?t=${Date.now()}`)).default;
    if (sectionImports) {
      routes = [
        {
          path: '/',
          component: sectionImports?.find((c) => c.name === 'home').instance,
        },
      ];
      sectionImports?.forEach((c) =>
        routes.push({
          path: `/${_page?.value}/${c?.name}`,
          component: c?.instance,
        }),
      );
      sectionImports?.forEach((c) => app.component(c?.name, c?.instance));
    }

    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });
    app.use(router);

    // const myAllBlackTheme = {
    //   dark: false,
    //   colors: {
    //     background: "#000000",
    //     primary: "#000000",
    //     secondary: "#000000",
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

    return app;
  } catch (e) {
    console.log(e);
  }
}
