import WebSocket from "ws";
import BinanceApi from "node-binance-api";

import { state, getExchange } from "./store.js";
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

      if (state.price === 0) {
        p9 = p8 = p7 = p6 = p5 = p4 = p3 = p2 = p1 = p0 = p;
      }
      
      state.price = p;

      p9 = p8; p8 = p7; p7 = p8; p7 = p6; p6 = p5; p5 = p4; p4 = p3; p3 = p2; p2 = p1; p1 = p0; p0 = p;
      state.avgPrice = (p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9) / 10;

      ///////////////////////////////////////////////////////////
      // BUY
      if (state.freeUsdt >= 10 && !state.buyOrderCreated && state.recentPrices[0] - 4 > state.price) {
        oneLine(`\x1b[42mBUY `, twoDecimals(state.avgPrice), twoDecimals(state.price), `Recent:  ${twoDecimals(state.recentPrices[0])}   Last: ${twoDecimals(state.lastPrice)}\n`);

        getExchange().createMarketBuyOrder(state.symbol, 0.0042);
        // await createOrder("buy", 0.0042, state.buyPrice);

        state.buyOrderCreated = true;
        state.buyPrice = state.avgPrice;
      }
    }
    catch(e) {
      err(e?.message);
      // warn(e?.stack);
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
