import ccxt from "ccxt";
import dotenv from "dotenv";
import minimist from "minimist";

dotenv.config();
const cliArgs = minimist(process.argv.slice(2));

///////////////////////////////////////////////////////////
export const state = {
  envUser: cliArgs.user ?? `auby`,
  exchange: null,
  symbol: cliArgs.symbol ?? process.env.symbol,
  spread: parseFloat(cliArgs.spread ?? process.env.spread),
  myAmount: parseFloat(cliArgs.myAmount ?? process.env.myAmount),
  multiplyBy: (cliArgs.multiplyBy ?? process.env.multiplyBy).split("|"),

  curPrice: 0,
  avgPrice: 0,
  lastPrice: 0,
  recentPrices: [],

  buyPrice: 0,
  buyPrice2: 0,
  buyOrders: [],
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

  let exchange = cliArgs.exchange ?? process.env.exchange;
  let apikey = cliArgs.apikey ?? process.env.apikey;
  let secret = cliArgs.secret ?? process.env.secret;
  
  if (state.envUser) {
    exchange = state.envUser.slice(2) === 'bi' ? 'binance' : 'bybit';
    apikey = process.env[`${state.envUser}-apikey`];
    secret = process.env[`${state.envUser}-secret`];
  }

  state.symbol += exchange === 'binance' ? '/TUSD' : '/USDC';
  
  state.exchange = new ccxt[exchange]({
    apiKey: apikey,
    secret: secret,
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
