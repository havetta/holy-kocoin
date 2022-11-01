import { getExchange, state } from "../store.js";

export async function createOrder(side, amount, price) {
  const type = "limit"; // or market
  const res = await getExchange().createOrder(state.symbol, type, side, amount, price);
  return res;
}


export async function createOrderStopPrice(side, amount, price, stopPrice) {
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

  const res = await getExchange().createOrder(state.symbol, type, side, amount, price, params);
  return res;
}

export async function createMarketOrderLimitTPSL(side, amount, stopLossPrice, takeProfitPrice) {
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

  const res = await getExchange().createMarketOrder(state.symbol, side, amount, params);
  return res;
}

export async function createMarketOrderTPSL(side, amount, stopLossPrice, takeProfitPrice) {
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

  const res = await getExchange().createMarketOrder(state.symbol, side, amount, params);
  return res;
}

export async function cancelAllOrders() {
  try {
    const res = await getExchange().cancelAllOrders(state.symbol);
    return res;
  }
  catch(e) {
    err(e?.message);
  }
}

export async function cancelOrder(id) {
  try {
    const res = await getExchange().cancelOrder(id, state.symbol);
    return res;
  }
  catch(e) {
    console.error(`\x1b[1m\x1b[31m${e?.message}\x1b[0m`);
  }
}

export async function cancelOldOrders() {
  if (new Date().getSeconds() % 15 === 0) { // every x seconds
    const orders = await getExchange().fetchOpenOrders(state.symbol);
    const xMinutesAgo = new Date(new Date() - 0.5 * 60000); // minus x minutes
    const buys = orders.filter(i => i.symbol === state.symbol && i.side === "sell");
    // for (let i in buys) {
    if (buys.length > 0) { let i = 0;
      const id = buys[i].id;
      if (new Date(buys[i].datetime) < xMinutesAgo && !state.cancelledOrders.includes(id)) {
        cancelOrder(id);
        state.cancelledOrders.push(id);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  else {
    if (state.cancelledOrders.length > 500)
      state.cancelledOrders = [];
  }
}