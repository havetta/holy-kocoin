import ccxt from "ccxt";

let state = null;

function setInitialState() {
  const exchange = new ccxt[process.env.exchange]({
    apiKey: process.env.apiKey,
    secret: process.env.secret,
    enableRateLimit: true,
  });

  state = {
    exchange: exchange,
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
