import WebSocket from "ws";
import BinanceApi from "node-binance-api";

import { state, getExchange } from "./store.js";
import { recentPriceAvg } from "./priceTrends.js";
import { err, oneLine } from "./utils/logger.js";
import { twoDecimals } from "./utils/formatter.js";

export function runWebSocket() {

  // const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${state.symbol.toLowerCase().replace("/", "")}@kline_1s`);
  // ws.on('message', function incoming(data) {
  //   const btc = JSON.parse(data);
  //   console.log(`\x1b[1m\x1b[33m`);
  //   console.table(btc)
  // });

  let p0, p1, p2, p3, p4, p5, p6, p7, p8, p9;
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${state.symbol.toLowerCase().replace("/", "")}@trade`);
  ws.on('message', function incoming(data) {
    try {
      const btc = JSON.parse(data);
      const p = new Number(btc.p);
      
      state.price = p;
      state.avgPrice = recentPriceAvg(-5, 5);  

      oneLine(`wait`, twoDecimals(state.avgPrice), twoDecimals(state.price),
      `Recent: ${twoDecimals(recentPriceAvg(0, 5))}   Buy : ${twoDecimals(state.buyPrice)}  stopLoss: ${state.stopLossOrder} Free: ${twoDecimals(state.freeBtc)}`);
      
      // ///////////////////////////////////////////////////////////
      // // BUY
      // if (!state.buyOrderCreated
      //   && state.freeUsdt >= state.tradeSum * (state.avgPrice - state.spread)
      //   && recentPriceAvg(0, 5) - state.spread > recentPriceAvg(-5, 5))
      // {
      //   state.buyPrice = state.avgPrice - state.spread / 2;

      //   oneLine(`\x1b[42mBUY `, twoDecimals(state.buyPrice), twoDecimals(state.price),
      //     `Recent: ${twoDecimals(recentPriceAvg(0, 5))}   Last: ${twoDecimals(state.lastPrice)}           \n`);

      //   // getExchange().createMarketBuyOrder(state.symbol, state.tradeSum);
      //   getExchange().createOrder(state.symbol, "limit", "buy", state.tradeSum, state.buyPrice);

      //   state.buyOrderCreated = true;
      //   state.stopLossOrder = false;
      // }
    }
    catch(e) {
      err(e?.message);
      warn(e?.stack);
    }
  });
  
  // INIT BINANCE LIB

  // const binance = new BinanceApi().options({
  //   APIKEY: process.env.apiKey,
  //   APISECRET: process.env.secret
  // });

  // binance.websockets.trades(['BTCUSDT', 'ETHUSDT'], (trades) => {
  //   let {e:eventType, E:eventTime, s:symbol, p:price, q:quantity, m:maker, a:tradeId} = trades;
  //   console.info(symbol+" trade update. price: "+price+", quantity: "+quantity+", maker: "+maker);
  // });
}
