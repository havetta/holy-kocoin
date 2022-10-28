import ccxt from "ccxt";
import { log } from "./utils/logger.js";
import { getExchange } from "./store.js";

export async function createOrder(side, amount, price) {
  const symbol = process.env.symbol;
  const type = "limit"; // or market
  // const side = "buy";
  // const amount = 0.0005;
  // const price = 20271;
  const params = {
      // "stopPrice": 20272,
      // "positionSide": "LONG", // and "SHORT",
      // "type": "stopLimit",
  };
  
  const res = await getExchange().createOrder(symbol, type, side, amount, price, params);

  // log(res);

  return res;
}

