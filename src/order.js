import ccxt from "ccxt";
import { log } from "./utils/logger.js";
import { getExchange } from "./store.js";

export async function createOrder() {
  const symbol = process.env.symbol;
  const type = "limit"; // or market
  const side = "buy";
  const amount = 0.0001;
  const price = 1500;
  const params = {
      "stopPrice": 1490,
      "type": "stopLimit",
  };
  
  const res = await getExchange().createOrder(symbol, type, side, amount, price, params);

  log(res);

  return res;
}

