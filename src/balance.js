import ccxt from "ccxt";
import { log } from "./utils/logger.js";
import { getExchange } from "./store.js";

export async function balance() {
  const res = await getExchange().fetch_balance();
  log(res.BTC);
  log(res.ETH);
  log(res.USDT);
}


export async function orderBook() {
  const res = await getExchange().fetch_order_book(process.env.symbol);
  log(res);
}

