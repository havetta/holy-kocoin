import { getExchange, state } from "../store.js";

export async function balance() {
  const res = await getExchange().fetchBalance();
  return res;
}

export async function fetchTicker() {
  const res = await getExchange().fetchTicker(state.symbol);
  return res;
}

export async function openOrders() {
  const res = await getExchange().fetchOpenOrders(state.symbol);
  return res;
}

export async function orderBook() {
  const res = await getExchange().fetchOrderBook(state.symbol);
  return res;
}

export async function positions() {
  const res = await getExchange().fetchPositions();
  return res;
}
