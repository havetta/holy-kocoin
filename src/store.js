import ccxt from "ccxt";
import dotenv from "dotenv";

dotenv.config();

///////////////////////////////////////////////////////////
export const state = {
  exchange: null,
  symbol: process.env.symbol,
  multiply: parseFloat(process.env.multiply),
  spread: parseFloat(process.env.spread),
  tradeSums: process.env.tradeSums.split("|"),

  curPrice: 0,
  avgPrice: 0,
  lastPrice: 0,
  recentPrices: [],

  buyPrice: 0,
  buyPrice2: 0,
  buyOrders: {},
  recentBuyPrices: [],
  buyOrderCreated: false,

  stopPrice: 0,
  stopLossOrder: false,

  cancelledOrders: [],

  freeBtc: 0,
  freeUsd: 0,
  balanceStr: ""
};
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export async function initExchange() {
  if (state.exchange)
    return;

  state.exchange = new ccxt[process.env.exchange]({
    apiKey: process.env.apikey,
    secret: process.env.secret,
    enableRateLimit: true,
    options: {
      defaultType: "spot",//future
    },
  });

  await state.exchange.load_time_difference();

  console.log("\x1b[1m\x1b[43m%s\x1b[0m", `Trading ${state.symbol} on ${process.env.exchange}`);
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function getExchange() {
  if (!state.exchange)
    initExchange();

  return state.exchange;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function getState() {
  return state;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function setState(newState) {
  state = newState;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
