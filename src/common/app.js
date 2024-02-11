// app.js (shared between server and client)
import { createSSRApp } from "vue";
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
  
  components.forEach(c => app.component(c.name, c.instance) );
  return app;
}
