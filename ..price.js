import WebSocket from "ws";

///////////////////////////////////////////////////////////
export function twoDecimals(num) {
  const noDecimal = Math.trunc(num);
  let res = `${noDecimal}.`;

  const twoDecimal = Math.trunc(num*100) - noDecimal*100;

  res += (new String(twoDecimal) + "00").substring(0,2);
  return res;
};
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function leftPad(str, len) {
  let res = new String(str);
  res = res.padEnd(len," ");
  res = res.substring(0, len);
  return res;
}
///////////////////////////////////////////////////////////




const state = {
  price: 0,
  rangeStart: 0,
};

const color = "\x1b[1m\x1b[42m*\x1b[0m";
let p0, p1, p2, p3, p4, p5, p6, p7, p8, p9;

// GET PRICE OVER BINANCE WEBSOCKET
const ws = new WebSocket(`wss://stream.binance.com:9443/ws/usdcusdt@trade`);
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
  if (diff > 33 || diff < -33) {
    state.rangeStart = p;
  }

  const avg = (p + p0 + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9) / 11;

  const diffPrevious = diff;
  const diffAvarage = avg - state.rangeStart;

  const priceAt = diffPrevious + 33;
  const avgAt = diffAvarage + 33;

  let msg = "";
  msg = msg.padStart(66);
  msg = msg.slice(0, priceAt) + "." + msg.slice(priceAt);
  msg = msg.slice(0, avgAt) + color + msg.slice(avgAt);
  process.stdout.write(twoDecimals(state.curPrice) + msg + "|\n");
});


String.prototype.replaceAt = function(index, char) {
    var a = this.split("");
    a[index] = char;
    return a.join("");
}