import { getExchange, state } from "./store.js";
import { err } from "./utils/logger.js";

export async function createOrder(side, amount, price) {
  const symbol = state.symbol;
  const type = "limit"; // or market
  const res = await getExchange().createOrder(symbol, type, side, amount, price);
  return res;
}


export async function createOrderStopPrice(side, amount, price, stopPrice) {
  const symbol = state.symbol;
  const type = "limit"; // or market
  const params = {
    // "stopLoss": {
    //   "type": "limit",
    //   "price": stopLossPrice,
    //   "triggerPrice": stopLossPrice
    // },
    // "takeProfit": {
    //   "type": "limit",
    //   "price": takeProfitPrice,
    //   "triggerPrice": takeProfitPrice
    // }
    "stopPrice": stopPrice,
    // "positionSide": "LONG", // and "SHORT",
    // "type": "stopLimit",
  };

  const res = await getExchange().createOrder(symbol, type, side, amount, price, params);
  return res;
}

export async function createMarketOrderLimitTPSL(side, amount, stopLossPrice, takeProfitPrice) {
  const symbol = state.symbol;
  const params = {
    "takeProfitPrice": 21000,
    "takeProfitTimeInForce": "GTC",
    // "stopLoss": {
    //   "type": "market",
    //   "triggerPrice": stopLossPrice
    // },
    // "takeProfit": {
    //   "type": "market",
    //   "triggerPrice": takeProfitPrice
    // }
    // "stopLoss": {
    //   "type": "limit",
    //   "price": stopLossPrice,
    //   "triggerPrice": stopLossPrice
    // },
    // "takeProfit": {
    //   "type": "limit",
    //   "price": takeProfitPrice,
    //   "triggerPrice": takeProfitPrice
    // }
  };

  const res = await getExchange().createMarketOrder(symbol, side, amount, params);
  return res;
}

export async function createMarketOrderTPSL(side, amount, stopLossPrice, takeProfitPrice) {
  const symbol = state.symbol;
  const params = {
    "stopLossPrice": 20000,
    "stopLossTimeInForce": "GTC",
    "takeProfitPrice": 21000,
    "takeProfitTimeInForce": "GTC",
  };
  // const params = {
  //   "stopLoss": {
  //     "type": "market",
  //     "triggerPrice": stopLossPrice
  //   },
  //   "takeProfit": {
  //     "type": "market",
  //     "triggerPrice": takeProfitPrice
  //   }
  // };

  const res = await getExchange().createMarketOrder(symbol, side, amount, params);
  return res;
}

export async function cancelOrder(id) {
  const symbol = state.symbol;
  try {
    const res = await getExchange().cancelOrder(id, symbol);
    return res;
  }
  catch(e) {
    err(e?.message);
  }
}

export async function cancelOldOrders() {
  if (new Date().getSeconds() % 10 === 0) { // every x seconds
    const orders = await getExchange().fetchOpenOrders(state.symbol);
    const xMinutesAgo = new Date(new Date() - 0.5 * 60000); // minus x minutes
    const buys = orders.filter(i => i.side === "buy" && i.symbol === state.symbol);
    for (let i in buys) {
      const id = buys[i].id;
      if (new Date(buys[i].datetime) < xMinutesAgo && !state.cancelledOrders.includes(id)) {
        cancelOrder(id);
        state.cancelledOrders.push(id);
      }
    }
  }
}