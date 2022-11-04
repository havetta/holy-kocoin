import { state } from "app"

export default {
  setup() {
    const logoutClick = () => state.loggedIn = !state.loggedIn;

    return {
      state,
      logoutClick,
    }
  },  
  template: `
    <nav class="navbar navbar-expand-lg shadow-md py-2 bg-white relative flex items-center w-full justify-between">
    <div class="px-6 w-full flex flex-wrap items-center justify-between">
      <div class="flex items-center">
        <button
          class="navbar-toggler border-0 py-3 leading-none text-xl bg-transparent text-gray-600 hover:text-gray-700 focus:text-gray-700 transition-shadow duration-150 ease-in-out mr-2"
          type="button">
          Welcome
        </button>
      </div>
      <div class="navbar-collapse collapse grow items-center" id="navbarSupportedContentY">
        <ul class="navbar-nav mr-auto lg:flex lg:flex-row">
          <navbutton @click="logoutClick()">Logout</navbutton>
        </ul>
      </div>
    </div>
  </nav>
`
}
