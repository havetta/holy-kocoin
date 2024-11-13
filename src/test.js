import { log, table, sameline, warn, err, oneLine } from "./utils/logger.js";
// import { state, getExchange, initExchange } from "./store.js";
import { RestClientV5 } from 'bybit-api';
import dotenv from 'dotenv';
dotenv.config();

const apikey = ;
const secret = ;

// import { runner } from "./runner.js";
// (async () => {
//   runner();
// })();



// import {readFileSync} from "fs"
// const string_output = readFileSync("jsconfig.json", 'utf8');
// console.log(string_output);


async function getMarkPrice() {
  const client = new RestClientV5({ key: process.env.k, secret: process.env.s, parseAPIRateLimits: true });
  const ret = await client.getMarkPriceKline({
    interval: '5', category: 'linear', symbol: 'BTCUSDT',
  });
  console.table(ret.result.list);
}

await getMarkPrice();



async function fetchBalance() {
  // setup Function as Value
  const mydict = {};
  const func = () => console.warn("running,,,")
  mydict['method'] = func;
  mydict['method']();
  mydict.method();
  mydict[func] = 'some value';
  console.warn(mydict[func]);

  // await initExchange();
  // const bal = await getExchange().fetchBalance();
  // console.log(`ETH: ${bal?.free['ETH']}`);
  // console.log(`USDC: ${bal?.free['USDC']}`);
  // console.log(`TUSD: ${bal?.free['TUSD']}`);

  let latest = 2230.645;
  const dt = new Date();
  const timeAsNumber = (dt.getDay()+3) * 1000000 + dt.getHours() * 10000 + dt.getMinutes() * 100 + dt.getSeconds();
  const setAmount = (timeAsNumber*0.00000000001 + state.smallestAmount).toFixed(11);

  // state.buyPrice = latest - state.spread;
  // const newOrder = await getExchange().createOrder(state.symbol, "limit", "buy", setAmount, state.buyPrice);
  // state.buyOrders.push(newOrder);
  // while (1==0) {
  //   const openOrders = await getExchange().fetchOpenOrders(state.symbol);
  //   console.log(Object.keys(state.buyOrders));

  //   const realizedBuyOrders = state.buyOrders.filter(buy => !openOrders.some(exi => exi.id === buy.id) );
  //   for (realized of realizedBuyOrders) {
  //     await getExchange().createOrder(state.symbol, "limit", "sell", realized.amount, realized.price + state.spread);
  //     state.buyOrders = state.buyOrders.filter(i => i.id !== realized.id);
  //   }
  // }
}



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

// Function to get the value for the first hour and fifth minute of the day
function getValueForTime(hour, minute) {
  let key = pad(hour) + ':' + pad(minute);
  return dict[key];
}

function runloop() {
  let date = new Date();
  let key = pad(date.getHours()) + ':' + pad(date.getMinutes());
  dict[key] = randomValue();
  console.log('Added:', key, dict[key],  Date.now()/1000 - (53 * 365 * 24 * 60 * 60));
  
  const dt = new Date();
  const time = (dt.getDay()+3) * 1000000 + dt.getHours() * 10000 + dt.getMinutes() * 100 + dt.getSeconds();
  //onsole.log((time*0.0000001).toFixed(7));
}

// Function to add a new entry every minute
// setInterval(runloop,  1000); // 60 * 1000 milliseconds == 1 minute
