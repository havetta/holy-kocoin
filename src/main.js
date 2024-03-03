import { createApp, ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './assets/scss/main.scss'
import App from './App.vue'
import { pageList as pgList } from '../public/_pageList.js'
import { pageImports as pgImports } from '../public/_pageImports.js'

const app = createApp(App);

const routes = [{ path: '/', component: pgImports.find((i) => i.shortpgname === '__mxp').sectionImports.find((s) => s.name === 'home').instance, }];

const allSections = [];

pgList.value.forEach((pg) => {
  const imp = pgImports.find((i) => i.shortpgname === pg.shortpgname).sectionImports;

  pg.sectionList.forEach((sec) => {
    const instance = imp.find((s) => s.name === sec.shortname);

    // Make tag name unique
    let uniqueName = sec.shortname;
    if (allSections.includes(sec.shortname))
      uniqueName = `${pg.shortpgname}-${sec.shortname}`;
    allSections.push(sec.shortname);
    
    console.log(`Section Tag: ${uniqueName}  => route:  /${pg.shortpgname}/${sec.shortname}`);

    app.component(uniqueName, instance) 

    routes.push({path: `/${pg.shortpgname}/${sec.shortname}`, component: instance});
  });
});

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// app.config.globalProperties.$router = router
app.use(router);
app.mount('#app');
