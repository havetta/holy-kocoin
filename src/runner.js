import { runWebSocket } from "./webSocket.js";
import { fastify } from "./server.js";
import { highestPrice, lowestPrice, recentPriceAvg, isDownTrend, isUpTrend } from "./helpers/priceTrends.js";
import { cancelOldOrders, createOrder, cancelOrder, cancelAllOrders, createOrderStopPrice } from "./services/order.js";
import { conf, state, getExchange, initExchange } from "./store.js";
import { log, table, sameline, warn, err, oneLine } from "./utils/logger.js";
import { twoDecimals, leftPad, rightPad } from "./utils/formatter.js";


// await cancelOldOrders(await getExchange().fetchOpenOrders(state.symbol), 2, "buy", "stop_loss_limit");


// /////////////////////////////////////////////////////////
//!  GET PRICE OVER BINANCE WEBSOCKET
// /////////////////////////////////////////////////////////
await initExchange();
runWebSocket();
// /////////////////////////////////////////////////////////


// /////////////////////////////////////////////////////////
//!  START WEB SERVER
// /////////////////////////////////////////////////////////
// fastify.get('/', async (request, reply) => { return 'trading bot running'; });
// /////////////////////////////////////////////////////////


// /////////////////////////////////////////////////////////
//!  TOP LEVEL AWAIT WORKAROUNT
// /////////////////////////////////////////////////////////
const runner = async () => {
  let openOrders = [];
  let countLoopsForBuy = 0;
  let upTrend = false, downTrend = false, lastDownTrend = false;

  // LOAD LIST OF ORDERS
  const bal = await getExchange().fetchBalance();
  console.log(`BTC: ${bal?.free['BTC']}`);
  console.log(`ETH: ${bal?.free['ETH']}`);
  console.log(`USDT: ${bal?.free['USDT']}`);
  console.log(`USDC: ${bal?.free['USDC']}`);
  console.log(`TUSD: ${bal?.free['TUSD']}`);
  
  openOrders = await getExchange().fetchOpenOrders(state.symbol);
  state.buyOrders = openOrders;
  console.log(`\x1b[1m\x1b[42mOPEN \x1b[91m ORDERS\x1b[104m`);  // 1m is bold, 0m is reset
  console.table(openOrders.map((i) => { return { datetime: i.datetime, side: i.side, price: i.price, amount: i.amount, usd: i.price*i.amount, status: i.status }; }));

  const closedOrders = await getExchange().fetchClosedOrders(state.symbol);
  console.log(`\x1b[45mCLOSED \x1b[93m ORDERS\x1b[101m`);  // 1m is bold, 0m is resets
  console.table(closedOrders.map(i => { return { datetime: i.datetime, side: i.side, price: i.price, amount: i.amount, usd: i.price*i.amount, status: i.status }; }));

  // WAIT FOR FIRST PRICE
  while (state.curPrice === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
    continue;
  }
  if (state.lastPrice === 0)
    state.lastPrice = state.curPrice;
  
  // GET LAST BUY PRICE
  if (state.buyPrice === 0) {
    const buys = openOrders.filter(i => i.symbol === state.symbol && i.side === "buy" && new Date(i.datetime) > new Date().setDate( new Date().getDate() - 3 ));
    state.buyPrice = state.curPrice;
    state.recentBuyPrices.push(state.buyPrice);
    console.log(`\x1b[1m\x1b[31mRESET\x1b[32m buy\x1b[33m price\x1b[34m to\x1b[35m last\x1b[36m ${state.buyPrice}\x1b[0m`);
  }


  //TODO /////////////////////////////////////////////////////////
  //TODO  LOOP
  //TODO /////////////////////////////////////////////////////////
  while (1) {
    oneLine(`\x1b[1m\x1b[45m${rightPad(countLoopsForBuy, 5)}`);

    // Wait x miliseconds
    await new Promise(resolve => setTimeout(resolve, 100));

    try
    {
      const [bal, openOrders] = await Promise.all( [
        getExchange().fetchBalance(),
        getExchange().fetchOpenOrders(state.symbol)
      ] );

      const pairBTC = state.symbol.split('/')[0];
      const pairUSD = state.symbol.split('/')[1];
      state.freeBtc = bal?.free[pairBTC];
      state.freeUsd = bal?.free[pairUSD];
      state.balanceStr = `${pairBTC} : ${leftPad(state.freeBtc, 8)}  ${pairUSD} : ${leftPad(state.freeUsd, 8)}`;

      lastDownTrend = downTrend;
      downTrend = isDownTrend();
      upTrend = isUpTrend();
      let latest = state.curPrice < state.lastPrice ? state.curPrice : state.lastPrice;
      let hour = new Date().getHours();
      let setAmount = state.smallestAmount * conf.multiplyBy[hour];

      //? /////////////////////////////////////////////////////////
      //!  CANCEL BUY OR SELL ORDERS (every x minutes) ////////////
      //? /////////////////////////////////////////////////////////
      state.buyOrders = await cancelOldOrders(state.buyOrders, 120, "buy", "stop_loss_limit"); // ignore stoploss

      // if (await cancelOldOrders(openOrders, 150, "sell", "stop_loss_limit")) {
      //   oneLine(`\x1b[43mRESET`, twoDecimals(state.buyPrice), twoDecimals(state.curPrice),
      //     `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   ${state.balanceStr}\n`);
      // }

      // const sells = openOrders.filter(i => i.symbol === state.symbol && i.side === "sell");
      // if (sells.length > 0) {
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      // }

      oneLine(`\x1b[42mBUY  `, twoDecimals(Math.min(...state.recentPrices) ), twoDecimals(state.curPrice),
      `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent15: ${twoDecimals(recentPriceAvg(-15, 15))}   ${state.balanceStr}\n`);


      //* /////////////////////////////////////////////////////////
      //*  BUY  ///////////////////////////////////////////////////
      //* /////////////////////////////////////////////////////////
      const buys = openOrders.filter(i => i.symbol === state.symbol && i.side === "buy");
      state.buyOrderCreated = buys.length > 0;

      if ( state.freeUsd >= state.curPrice * setAmount
        && countLoopsForBuy > 1000
        // && state.curPrice < state.lastPrice
        // && state.avgPrice > state.curPrice
        // && !upTrend
        // && !state.buyOrderCreated
        )
      {
        countLoopsForBuy = 0;

        state.recentBuyPrices.push(state.buyPrice);
        if (state.recentBuyPrices.length > 5)  // keep last x prices
          state.recentBuyPrices.shift();

        state.buyPrice = (state.curPrice < state.lastPrice ? state.curPrice : state.lastPrice);
        state.buyPrice = Math.min(...state.recentPrices) - state.spread; // websocket price difference should be corrected

        oneLine(`\x1b[42mBUY  `, twoDecimals(state.buyPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent15: ${twoDecimals(recentPriceAvg(-15, 15))}   ${state.balanceStr}\n`);

        try {
          // await getExchange().ceateMarketBuyOrder(state.symbol, setAmount);
          const newOrder = await getExchange().createOrder(state.symbol, "limit", "buy", setAmount, state.buyPrice);
          newOrder.amount = setAmount;
          newOrder.price = state.buyPrice;

          state.buyOrders.push(newOrder);
          state.buyOrderCreated = true;
        } catch(e) {
          err(e?.message);
        }
      }



      //! /////////////////////////////////////////////////////////
      //!  SELL ///////////////////////////////////////////////////
      //! /////////////////////////////////////////////////////////
      if (state.freeBtc >= state.smallestAmount + 0.024)
      {
        // await getExchange().createMarketSellOrder(state.symbol, state.smallestAmount);
        // await getExchange().createOrder(state.symbol, "limit", "sell", state.smallestAmount, state.buyPrice + state.spread);

        const realizedBuyOrders = state.buyOrders.filter(buy => !openOrders.some(exi => exi.id === buy.id) );
        for (let realized of realizedBuyOrders) {
          oneLine(`\x1b[41mSELL `, twoDecimals(realized.price + state.spread), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent15: ${twoDecimals(recentPriceAvg(-15, 15))}   ${state.balanceStr}\n`);

          await getExchange().createOrder(state.symbol, "limit", "sell", realized.amount, realized.price + state.spread);
          state.buyOrders = state.buyOrders.filter(i => i.id !== realized.id);
        }
      }

/*
      //? /////////////////////////////////////////////////////////
      //?  STOP LOSS
      //? /////////////////////////////////////////////////////////
      const stopLoss = openOrders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
      state.stopLossOrder = stopLoss.length > 0;
      let stopPrice = latest-state.spread*2;

      if (state.stopLossOrder && stopPrice > state.stopPrice+3) {
        state.stopPrice = stopPrice;

        // EDIT STOP LOSS
        oneLine(`\x1b[4mEDIT `, twoDecimals(stopPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}\n`);

        const id = stopLoss[0].id;
        await getExchange().editOrder(id, state.symbol, "limit", "sell", amount, stopPrice-10, {"stopPrice": stopPrice}); // stopPrice = Trigger Condition
      }

      if (1==2 && !state.stopLossOrder && state.freeBtc >= amount) {
        stopPrice = lowestPrice(-10, 10) - state.spread*4;
        state.stopPrice = stopPrice;
    
        // CREATE STOP LOSS
        oneLine(`\x1b[4mSTOP `, twoDecimals(stopPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}\n`);

        try {
          await getExchange().createOrder(state.symbol, "limit", "sell", amount, stopPrice-10, {"stopPrice": stopPrice}); // stopPrice = Trigger Condition
        } catch(e) {
          err(e?.message);
        }
      }



      //? ///////////////////////////////////////////////////////////
      //?  CANCEL STOP LOSS
      //? ///////////////////////////////////////////////////////////
      // if (state.stopLossOrder
      //   && state.avgPrice > state.buyPrice + state.spread / 2) // current price avarage ABOVE buy price plus half spread (WINNING TRADE)
      // {
      //   openOrders = await getExchange().fetchOpenOrders(state.symbol);
      //   const stopLoss = openOrders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
      //   for (let i in stopLoss) {
      //     await cancelOrder(stopLoss[i].id);
      //     state.stopLossOrder = false;
      //   }
      // }
*/
      //* /////////////////////////////////////////////////////////
      //*  Memorize last price
      //* /////////////////////////////////////////////////////////
      state.lastPrice = state.curPrice;
      countLoopsForBuy++;
    }
    catch(e) {
      if (e?.message != `binance Stop price would trigger immediately.`)
        err(e?.message);
      // warn(e?.stack);
    }
  }
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export { runner };