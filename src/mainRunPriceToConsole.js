import dotenv from "dotenv";
import WebSocket from "ws";

import { twoDecimals, leftPad } from "./utils/formatter.js";

dotenv.config();
const state = {
  price: 0,
  rangeStart: 0,
  symbol: process.env.symbol
};

const color = "\x1b[1m\x1b[42m*\x1b[0m";
let p0, p1, p2, p3, p4, p5, p6, p7, p8, p9;

// GET PRICE OVER BINANCE WEBSOCKET
const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${state.symbol.toLowerCase().replace("/", "")}@trade`);
ws.on('message', function incoming(data) {
  const btc = JSON.parse(data);
  state.curPrice = new Number(btc.p);
  const p = state.curPrice * 10;

  if (state.rangeStart === 0) {
    state.rangeStart = p;
    p9 = p8 = p7 = p6 = p5 = p4 = p3 = p2 = p1 = p0 = p;
  }

  p9 = p8; p8 = p7; p7 = p6; p6 = p5; p5 = p4; p4 = p3; p3 = p2; p2 = p1; p1 = p0; p0 = p;
  
  const diff = p - state.rangeStart;
  if (diff > 100 || diff < -100) {
    state.rangeStart = p;
  }

  const avg = (p + p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9) / 11;

  const diffP = diff;
  const diffA = avg - state.rangeStart;

  const priceAt = diffP + 100;
  const avgAt = diffA + 100;

  let msg = "";
  msg = msg.padStart(200);
  msg = msg.slice(0, priceAt) + "." + msg.slice(priceAt);
  msg = msg.slice(0, avgAt) + color + msg.slice(avgAt);
  process.stdout.write(twoDecimals(state.curPrice) + msg + "|\n");
});


String.prototype.replaceAt = function(index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}