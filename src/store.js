import ccxt from "ccxt";

let state = null;

export async function setInitialState() {
  const exchange = new ccxt[process.env.exchange]({
    apiKey: process.env.apiKey,
    secret: process.env.secret,
    enableRateLimit: true,
    // options: {
    //   defaultType: "future",
    // },
  });

  await exchange.load_time_difference();

  console.log(`Trading ${process.env.symbol} on ${process.env.exchange}`);

  state = {
    exchange: exchange,
    lastPrice: 0,
    buyOrderCreated: true,
    buyPrice: 0,
    symbol: process.env.symbol,
  };
}

export function getExchange() {
  if (!state)
    setInitialState();

  return state.exchange;
}

export function getState() {
  return state;
}

export function setState(newState) {
  state = newState;
}
