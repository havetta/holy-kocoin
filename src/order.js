import ccxt from "ccxt";
import { log } from "./utils/logger.js";
import { getExchange } from "./store.js";

export async function createOrder(side, amount, price) {
  const symbol = process.env.symbol;
  const type = "limit"; // or market
  const params = {
    // "stopPrice": 20272,
    // "positionSide": "LONG", // and "SHORT",
    // "type": "stopLimit",
    "stopLoss": {
      "type": "market", // or "limit" with price
      // "price": 
      "triggerPrice": price - price * 0.001, // 0.1%
    },
    "takeProfit": {
        "type": "market",
        "triggerPrice": price - price * 0.001, // 0.1%
    }
  };

  const res = await getExchange().createOrder(symbol, type, side, amount, price, params);

  return res;
}

export async function createMarketOrder(side, amount, stopLossPrice, takeProfitPrice) {
  const symbol = process.env.symbol;
  const params = {
    "stopLoss": {
      "type": "market",
      "triggerPrice": stopLossPrice
    },
    "takeProfit": {
        "type": "market",
        "triggerPrice": takeProfitPrice
    }
  };

  const res = await getExchange().createMarketOrder(symbol, side, amount, params);

  return res;
}