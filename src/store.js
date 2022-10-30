import ccxt from "ccxt";

export const state = {
  exchange: null,
  lastPrice: 0,
  buyOrderCreated: false,
  buyPrice: 0,
  symbol: '',
  cancelledOrders: [],
};

export async function setInitialState() {

  state.symbol = process.env.symbol;

  state.exchange = new ccxt[process.env.exchange]({
    apiKey: process.env.apiKey,
    secret: process.env.secret,
    enableRateLimit: true,
    // options: {
    //   defaultType: "future",
    // },
  });

  await state.exchange.load_time_difference();

  console.log("\x1b[46m%s\x1b[0m", `Trading ${state.symbol} on ${process.env.exchange}`);
  console.log("\x1b[47m%s\x1b[0m", `Trading ${state.symbol} on ${process.env.exchange}`);
}

export function getExchange() {
  if (!state.exchange)
    setInitialState();

  return state.exchange;
}

export function getState() {
  return state;
}

export function setState(newState) {
  state = newState;
}
