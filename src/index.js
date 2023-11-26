var mydict = {};

var f = function () {
  console.warn("running,,,")
};


// setup Function as Value
mydict['method'] = f;
mydict['method']();
mydict.method();

mydict[f] = 'some value';
console.warn(mydict[f]);

import { state, getExchange, initExchange } from "./store.js";
await initExchange();
const bal = await getExchange().fetchBalance();
console.log(`BTC: ${bal?.free['BTC']}`);
console.log(`ETH: ${bal?.free['ETH']}`);
console.log(`USDT: ${bal?.free['USDT']}`);
console.log(`USDC: ${bal?.free['USDC']}`);
console.log(`TUSD: ${bal?.free['TUSD']}`);

let latest = 2030.245;
const dt = new Date();
const timeAsNumber = (dt.getDay()+3) * 1000000 + dt.getHours() * 10000 + dt.getMinutes() * 100 + dt.getSeconds();
const amount = (timeAsNumber*0.00000000001 + state.tradeSums[0] * state.multiply).toFixed(11);
state.buyPrice = latest - state.spread;
const newOrder = await getExchange().createOrder(state.symbol, "limit", "buy", amount, state.buyPrice);
const existingOrders = await getExchange().fetchOpenOrders(state.symbol);


// Create a dictionary
let dict = {};

// Function to pad single digit numbers with leading zero
function pad(n) {
  return n < 10 ? '0' + n : n;
}

// Function to generate a random value
function randomValue() {
  return Math.floor(Math.random() * 100);
}

// Function to add a new entry every minute
setInterval(function () {
  let date = new Date();
  let key = pad(date.getHours()) + ':' + pad(date.getMinutes());
  dict[key] = randomValue();
  //console.log('Added:', key, dict[key],  Date.now()/1000 - (53 * 365 * 24 * 60 * 60));
  const dt = new Date();
  const time = (dt.getDay()+3) * 1000000 + dt.getHours() * 10000 + dt.getMinutes() * 100 + dt.getSeconds();
  console.log((time*0.0000001).toFixed(7));

},  1000); // 60 * 1000 milliseconds == 1 minute

// Function to get the value for the first hour and fifth minute of the day
function getValueForTime(hour, minute) {
  let key = pad(hour) + ':' + pad(minute);
  return dict[key];
}