import ccxt from "ccxt";
import dotenv from "dotenv";
import minimist from "minimist";

dotenv.config();
const cliArgs = minimist(process.argv.slice(2));

export const conf = {
  usr: cliArgs.usr ?? `mi`,
  multiplyBy: [1.024,1.001,1.002,1.003,1.004,1.005,1.006,1.007,1.008,1.009,1.010,1.011,1.012,1.013,1.014,1.015,1.016,1.017,1.018,1.019,1.020,1.021,1.022,1.023],
  exchangeName: {
    au: `bybit`,
    si: `binance`,
    mi: `bybit`,
  },
  symbol: {
    au: `SOL`,
    si: `BTC`,
    mi: `BTC`,
  },
  stable: {
    au: `USDC`,
    si: `FDUSD`,
    mi: `USDC`,
  },
  spread: {
    au: 0.5,
    si: 30,
    mi: 9,
  },
  port: {
    au: 3331,
    si: 3332,
    mi: 3333,
  },
  buyEveryXSeconds: { // 1200 = 30 minutes
    au: 600,
    si: 300,
    mi: 151,
  },
  smallestAmount: {
    au: 1.2, // BTC
    si: 0.01, // BTC
    mi: 0.019, // BTC
  },
}

///////////////////////////////////////////////////////////
export const state = {
  exchange: null,

  symbol: conf?.symbol?.[conf.usr] ?? cliArgs.symbol ?? process.env.symbol ?? 'BTC',
  stable: conf?.stable?.[conf.usr] ?? cliArgs.stable ?? process.env.stable ?? 'USDT',
  spread: conf?.spread?.[conf.usr] ?? cliArgs.spread ?? process.env.spread ?? 50,
  smallestAmount: parseFloat(conf?.smallestAmount?.[conf.usr] ?? cliArgs.amount ?? process.env.amount ?? 0.001),
  buyEveryXSeconds: conf?.buyEveryXSeconds?.[conf.usr] ?? 1200,

  curPrice: 0,
  avgPrice: 0,
  lastPrice: 0,
  recentPrices: [],
  recentBuyPrices: [],
  buyPrice: 0,
  buyOrderCreated: false,
  buyOrders: [],
  realizedBuyOrders: [],

  cancelledOrders: [],
  openOrders: [],

  stopPrice: 0,
  stopLossOrder: false,
  
  freeBtc: 0,
  freeUsd: 0,
  balanceStr: ``,
};
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export async function initExchange() {
  if (state.exchange)
    return;
  
  const exchangeName = conf.exchangeName[conf.usr] ?? cliArgs.exchangeName ?? process.env.exchangeName;

  state.symbol += '/' + state.stable;
  
  state.exchange = new ccxt[exchangeName]({
    apiKey: process.env[`${conf.usr}-apikey`],
    secret: process.env[`${conf.usr}-secret`],
    enableRateLimit: true,
    options: {
      defaultType: "spot",//future
    },
  });

  await state.exchange.load_time_difference();

  // console.log("\x1b[1m\x1b[43m%s\x1b[0m", `Trading ${state.symbol} on ${exchangeName}`);
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
