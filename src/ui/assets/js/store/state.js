import { reactive } from "vue"

export const state = reactive({
  loggedIn: true,
  loginClick() {
    this.loggedIn = true;
  }
});
