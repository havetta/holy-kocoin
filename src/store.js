import ccxt from "ccxt";
import dotenv from "dotenv";

dotenv.config();

export const state = {
  exchange: null,
  symbol: process.env.symbol,
  spread: process.env.spread,
  tradeSum: process.env.tradeSum,

  price: 0,
  avgPrice: 0,
  lastPrice: 0,
  recentPrices: [],
  buyPrice: 0,

  buyOrderCreated: false,
  stopLossOrder: false,
  cancelledOrders: [],

  freeBtc: 0,
  freeUsdt: 0,
};

export async function initExchange() {

  state.exchange = new ccxt[process.env.exchange]({
    apiKey: process.env.apiKey,
    secret: process.env.secret,
    enableRateLimit: true,
    // options: {
    //   defaultType: "future",
    // },
  });

  await state.exchange.load_time_difference();

  console.log("\x1b[1m\x1b[43m%s\x1b[0m", `Trading ${state.symbol} on ${process.env.exchange}`);
}

export function getExchange() {
  if (!state.exchange)
    initExchange();

  return state.exchange;
}

export function getState() {
  return state;
}

export function setState(newState) {
  state = newState;
}
