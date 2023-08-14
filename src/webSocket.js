import WebSocket from "ws";
import BinanceApi from "node-binance-api";

import { state, getExchange } from "./store.js";
import { recentPriceAvg } from "./helpers/priceTrends.js";
import { err, oneLine } from "./utils/logger.js";
import { twoDecimals, rightPad } from "./utils/formatter.js";

export function runWebSocket() {

  // const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${state.symbol.toLowerCase().replace("/", "")}@kline_1s`);
  // ws.on('message', function incoming(data) {
  //   const btc = JSON.parse(data);
  //   console.log(`\x1b[1m\x1b[33m`);
  //   console.table(btc)
  // });

  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${state.symbol.toLowerCase().replace("/", "")}@trade`);
  ws.on('message', function incoming(data) {
    try {
      const btc = JSON.parse(data);
      const p = new Number(btc.p);
      
      state.curPrice = p;
      state.avgPrice = recentPriceAvg(-5, 5);

      state.recentPrices.push(state.curPrice);
      if(state.recentPrices.length > 30)  // keep last x prices
        state.recentPrices.shift();

      const tick = rightPad(Math.random(), 4);
      oneLine(tick, twoDecimals(state.avgPrice), twoDecimals(state.curPrice),
        `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}`);
      
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
