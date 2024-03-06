import { createApp, ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './assets/scss/main.scss'
import App from './App.vue'
import { pageList } from '../public/_pageList.js'
import { pageImports } from '../public/_pageImports.js'
// import { useScriptTag, useStyleTag } from '@vueuse/core'  //  npm i @vueuse/core

const app = createApp(App);

const routes = [{ path: '/', component: pageImports.find((i) => i.shortpgname === '__mxp').sectionImports.find((s) => s.name === 'home').instance, }];

const allTagNames = [];

pageList.value.forEach((pg) => {
  const imp = pageImports.find((i) => i.shortpgname === pg.shortpgname).sectionImports;
  const shortpgnameTag = pg.shortpgname.replace(/_/g,'');

  pg.sectionList.forEach((sec) => {

    // Make tag name unique
    let uniqueTagName = sec.shortname;
    if (allTagNames.includes(sec.shortname) || sec.shortname === 'home')
      uniqueTagName = `${shortpgnameTag}-${sec.shortname}`;
    allTagNames.push(sec.shortname);
    
    console.log(`Section Tag: ${uniqueTagName}  => route:  /${shortpgnameTag}/${sec.shortname}`);

    const componentInstance = imp.find((s) => s.name === sec.shortname).instance;
    app.component(uniqueTagName, componentInstance) 
    routes.push({path: `/${pg.shortpgname}/${sec.shortname}`, component: componentInstance});
  });
});

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// app.config.globalProperties.$router = router
app.use(router);
app.mount('#app');
