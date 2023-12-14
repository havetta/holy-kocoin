import { stateCcxt } from "../store/stateCcxt.js"

export async function initExchange() {
  while (!stateCcxt.ccxt) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  stateCcxt.exchange = new stateCcxt.ccxt["binance"]({
    apikey: localStorage.getItem("apikey"),
    secret: localStorage.getItem("secret"),
    enableRateLimit: true,
    // options: {
    //   defaultType: "future",
    // },
  });

  await stateCcxt.exchange.load_time_difference();
}

export async function getExchange() {
  if (!stateCcxt.exchange)
    await initExchange();
  
  return stateCcxt.exchange;
}