import { reactive } from "vue"

export const state = reactive({
  ccxt: ccxt,

  price: 0,
  symbol: "BTC/USDT",

  loggedIn: true,
  loginClick() {
    this.loggedIn = true;
  }
})
