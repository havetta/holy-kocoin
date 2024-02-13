// app.js (shared between server and client)
import { createSSRApp } from "vue";
// import { createRouter, createWebHashHistory } from 'vue-router'
import components from "../datatypes/components.js"

export function createApp(req) {
  let component = req?.query?.page;
  if (typeof window === 'object')
  {
    const urlParams = new URLSearchParams(window?.location?.search);
    component = urlParams.get('page');
  }

  if (!component)
    component = 'root';

  const app = createSSRApp({
    template: `<${component} />`,
  });

  // const home = { template: '<div>home</div>' }
  // const conf = { template: '<div>conf</div>' }
  
  // const router = createRouter({
  //   history: createWebHashHistory(),
  //   routes: [
  //     { path: '/', component: components.find(c => c.name === 'root').instance },
  //     { path: '/home', component: home },
  //     { path: '/conf', component: conf },
  //   ],
  // })

  // app.use(router);

  components.forEach(c => app.component(c.name, c.instance) );
  return app;
}
