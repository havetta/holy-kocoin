// app.js (shared between server and client)
import { createSSRApp } from "vue";
import components from "./components.js"

export function createApp(req) {
  let component = req?.query?.goto;
  if (typeof window === 'object')
  {
    const urlParams = new URLSearchParams(window?.location?.search);
    component = urlParams.get('goto');
  }

  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `
      <${component} />
    `,
  });
  
  components.forEach(c => app.component(c.name, c.component) );
  return app;
}
