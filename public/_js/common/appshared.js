import { createSSRApp, ref } from "vue";
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
} from "../../_npm/vue-router.esm-browser.js";
// import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'

import { pageList } from "../../_pageList.js";
import { pageImports } from "../../_pageImports.js";

// import { GButton, GCell, GCellHeader, GFixedBottom, GText } from '../../_npm/@george/core/dist/george-library.js';
// import { createVuetify, components, directives  } from '../../_npm/vuetify.esm.js'

//TODO /////////////////////////////////////////////////////////
//TODO   processUrl  ///////////////////////////////////////////
//TODO /////////////////////////////////////////////////////////
const _page = ref("");
const _section = ref("");

const processUrl = (req) => {
  console.log(req?.query);
  let query = Object.keys(req?.query ?? {})?.[0] ?? "__mxp";
  let hash = new String(query).replace("#/", "").split("/");
  let page = hash?.[0];
  let section = hash?.[1];

  if (typeof window === "object") {
    hash = new String(window?.location?.search)
      .replace("?", "")
      .replace("#/", "")
      .split("/");
    if (!hash) hash = window?.location?.hash?.replace("#/", "").split("/");

    if (hash?.[0]) page = hash?.[0];
    if (hash?.[1]) section = hash?.[1];
  }

  if (!section) section = "home";
  _page.value = page === "" ? "__mxp" : page ?? "__mxp";
  _section.value = section === "" ? "home" : section ?? "home";
  console.log(`page: ${_page.value}`);
  console.log(`section: ${_section.value}`);
};

//TODO /////////////////////////////////////////////////////////
//TODO   createApp  ////////////////////////////////////////////
//TODO /////////////////////////////////////////////////////////
export async function createApp(req) {
  try {
    processUrl(req);

    let root = `<${_section?.value} />`;
    if (_section?.value === "home")
      root = `<${_page?.value.replace(/_/g, "")}-${_section?.value} />`;

    const app = createSSRApp({ template: root });
    const routes = [
      {
        path: "/",
        component: pageImports
          .find((i) => i.shortpgname === "__mxp")
          .sectionImports.find((s) => s.name === "home").instance,
      },
    ];

    const allTagNames = [];

    pageList.value.forEach((pg) => {
      const imp = pageImports.find(
        (i) => i.shortpgname === pg.shortpgname,
      ).sectionImports;
      const shortpgnameTag = pg.shortpgname.replace(/_/g, "");

      pg.sectionList.forEach((sec) => {
        // Make tag name unique
        let uniqueTagName = sec.shortname;
        if (allTagNames.includes(sec.shortname) || sec.shortname === "home")
          uniqueTagName = `${shortpgnameTag}-${sec.shortname}`;
        allTagNames.push(sec.shortname);

        // console.log(`Section Tag: ${uniqueTagName}  => route:  /${shortpgnameTag}/${sec.shortname}`);

        const componentInstance = imp.find(
          (s) => s.name === sec.shortname,
        ).instance;
        app.component(uniqueTagName, componentInstance);
        routes.push({
          path: `/${pg.shortpgname}/${sec.shortname}`,
          component: componentInstance,
        });
      });
    });

    /*    const routes = [];
    const sectionImports = (await import(`../../${_page.value}/_sectionImports.js?t=${Date.now()}`)).default;
    if (sectionImports) {
      routes.push({ path: '/', component: sectionImports?.find((c) => c.name === 'home').instance });
      sectionImports?.forEach((c) => routes.push({ path: `/${_page?.value}/${c?.name}`, component: c?.instance }) );
      sectionImports?.forEach((c) => app.component(c?.name, c?.instance) );
    }
*/
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
