import { state } from "appImports"

export default {
  setup() {
    const logoutClick = () => state.loggedIn = !state.loggedIn;

    return {
      state,
      logoutClick,
    }
  },  
  template: `
    <navbutton @click="logoutClick()">Logout</navbutton>
  `
}
