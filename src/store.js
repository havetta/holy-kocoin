import ccxt from "ccxt";
import dotenv from "dotenv";
import minimist from "minimist";

dotenv.config();
const cliArgs = minimist(process.argv.slice(2));

export const conf = {
  usr: cliArgs.usr ?? `au`,
  multiplyBy: [1.024,1.001,1.002,1.003,1.004,1.005,1.006,1.007,1.008,1.009,1.010,1.011,1.012,1.013,1.014,1.015,1.016,1.017,1.018,1.019,1.020,1.021,1.022,1.023],
  port: {
    au: 3333,
    mi: 3334,
  },
  amount: {
    au: 0.01,
    mi: 0.0004,
  },
  exchangeName: {
    au: `bybit`,
    mi: `binance`,
  },
}

///////////////////////////////////////////////////////////
export const state = {
  exchange: null,

  symbol: cliArgs.symbol ?? process.env.symbol,
  spread: parseFloat(cliArgs.spread ?? process.env.spread),
  smallestAmount: parseFloat(conf.amount[conf.usr] ?? cliArgs.amount ?? process.env.amount),

  curPrice: 0,
  avgPrice: 0,
  lastPrice: 0,
  recentPrices: [],

  buyPrice: 0,
  buyOrders: [],
  realizedBuyOrders: [],
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
  
  const exchangeName = conf.exchangeName[conf.usr] ?? cliArgs.exchangeName ?? process.env.exchangeName;

  state.symbol += (exchangeName === 'binance' ? '/TUSD' : '/USDC');
  
  state.exchange = new ccxt[exchangeName]({
    apiKey: process.env[`${conf.usr}-apikey`],
    secret: process.env[`${conf.usr}-secret`],
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
