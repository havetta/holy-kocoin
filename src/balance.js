import ccxt from "ccxt";
import { log } from "./utils/logger.js";
import { getExchange } from "./store.js";

export async function balance() {
  const res = await getExchange().fetchBalance();
  log(res);
  log(res.free[`BTC`]);
  log(res.free[`ETH`]);
  log(res.free[`USDT`]);
}

export async function fetchTicker() {
  const res = await getExchange().fetchTicker(process.env.symbol);
  return res;
}

export async function openOrders() {
  const res = await getExchange().fetchOpenOrders(process.env.symbol);
  log(res);
}

export async function orderBook() {
  const res = await getExchange().fetchOrderBook(process.env.symbol);
  log(res);
}

