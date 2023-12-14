import { reactive } from "vue"

export const stateCcxt = reactive({
  exchange: null,
  ccxt: null,

  apikey: null,
  secret: null,

  curPrice: 0,
  tradeSymbol: "BTC/USDT",
})
