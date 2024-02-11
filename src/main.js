import { createApp, ref } from 'vue'
import './css/common.css'
import App from './App.vue'
import root from './components/root.js'

import components from "./datatypes/components.js"
// import test from "./components/test"
// import state from "./datatypes/state"

const app = createApp(App)
components.forEach(c => app.component(c.name, c.component) );
app.component("test1", {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button class="btn" @click="count++">
      Clicked {{ count }} times
    </button>`,
  mounted() {
    console.log(`test1 component mounted`)
  },
  // template: `for TESTING<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>`
})
app.mount('#app')
