import WebSocket from "ws";

import { conf, state, getExchange } from "./store.js";
import { recentPriceAvg } from "./utils/priceTrends.js";
import { err, oneLine } from "./utils/logger.js";
import { twoDecimals, rightPad } from "./utils/formatter.js";

export function runWebSocket() {

  // const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${state.symbol.toLowerCase().replace("/", "")}@kline_1s`);
  // ws.on('message', function incoming(data) {
  //   const json = JSON.parse(data);
  //   console.log(`\x1b[1m\x1b[33m`);
  //   console.table(json)
  // });

  const exchangeName = conf.exchangeName[conf.usr] ?? cliArgs.exchangeName ?? process.env.exchangeName;

  const quicklyChangingPriceSymbol = state.symbol.toUpperCase().replace("/", "") //.split("/")[0] + "USDT"
  let url = `wss://stream.binance.com:9443/ws/${quicklyChangingPriceSymbol.toLowerCase()}@trade`;
  if (exchangeName === "bybit")
    url = `wss://stream.bybit.com/v5/public/spot`;

  const ws = new WebSocket(url);
  ws.on('open', function (e) {
    console.log(`\x1b[1m\x1b[33m onopen`);
    if (exchangeName === "bybit")
      ws.send(`{"op":"subscribe","args":["tickers.${quicklyChangingPriceSymbol}"]}`);
  });
  
  ws.on('message', function incoming(data) {
    try {
      const json = JSON.parse(data);
      let p = new Number(json?.p);
      if (exchangeName === "bybit")
        p = new Number(json?.data?.lastPrice);
        
      state.curPrice = p;
      state.avgPrice = recentPriceAvg(-5, 5);

      state.recentPrices.push(state.curPrice);
      if(state.recentPrices.length > 30)  // keep last x prices
        state.recentPrices.shift();

      const tick = rightPad(Math.random(), 5);
      oneLine(tick, twoDecimals(state.avgPrice), twoDecimals(state.curPrice),
        `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}      ${state.balanceStr}`);
      
    }
    catch(e) {
      err(e?.message);
      warn(e?.stack);
    }
  });
}
