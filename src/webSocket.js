import WebSocket from "ws";
import BinanceApi from "node-binance-api";

import { state, getExchange } from "./store.js";
import { recentPriceAvg } from "./helpers/priceTrends.js";
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
      
      state.curPrice = p;
      state.avgPrice = recentPriceAvg(-15, 15);

      state.recentPrices.push(state.curPrice);
      if(state.recentPrices.length > 300)  // keep last x prices
        state.recentPrices.shift();

      oneLine(`wait`, twoDecimals(state.avgPrice), twoDecimals(state.curPrice),
        `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}`);
      
      // ///////////////////////////////////////////////////////////
      // // BUY
      // if (!state.buyOrderCreated
      //   && state.freeUsdt >= state.tradeSums[0] * (state.avgPrice - state.spread)
      //   && recentPriceAvg(0, 15) - state.spread > recentPriceAvg(-15, 15))
      // {
      //   state.buyPrice = state.avgPrice - state.spread / 2;

      //   oneLine(`\x1b[42mBUY `, twoDecimals(state.buyPrice), twoDecimals(state.curPrice),
      //     `Recent: ${twoDecimals(recentPriceAvg(0, 15))}   Last: ${twoDecimals(state.lastPrice)}           \n`);

      //   // getExchange().createMarketBuyOrder(state.symbol, state.tradeSums[0]);
      //   getExchange().createOrder(state.symbol, "limit", "buy", state.tradeSums[0], state.buyPrice);

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
