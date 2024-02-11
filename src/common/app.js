// app.js (shared between server and client)
import { createSSRApp } from "vue";
import components from "../datatypes/components.js"
import state from "../datatypes/state.js"

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
    data: () => ({ state }),
    template: `
    <button class="btn" @click="state.selectedId++">Add {{ state.selectedId }}</button>
    <${component} />`,
  });
  
  components.forEach(c => app.component(c.name, c.component) );
  return app;
}
