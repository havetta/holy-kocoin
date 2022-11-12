import { createApp } from "vue"
import { state, stateCcxt, statePanel } from "appImports"

export const app = createApp({
  setup() {
    return { state, stateCcxt, statePanel }
  }
});