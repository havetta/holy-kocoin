import { runWebSocket } from "./webSocket.js";
import { fastify } from "./server.js";
import { exchanges } from "./services/exchange.js";
import { highestPrice, lowestPrice, recentPriceAvg, isDownTrend, isUpTrend } from "./helpers/priceTrends.js";
import { cancelOldOrders, createOrder, cancelOrder, cancelAllOrders, createOrderStopPrice } from "./services/order.js";
import { state, getExchange, initExchange } from "./store.js";
import { log, table, sameline, warn, err, oneLine } from "./utils/logger.js";
import { twoDecimals, leftPad, rightPad } from "./utils/formatter.js";


///////////////////////////////////////////////////////////
// GET PRICE OVER BINANCE WEBSOCKET
///////////////////////////////////////////////////////////
runWebSocket();
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// START WEB SERVER
///////////////////////////////////////////////////////////
fastify.get('/', async (request, reply) => { return 'running'; });
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// TOP LEVEL AWAIT WORKAROUNT
///////////////////////////////////////////////////////////
const mainRunSpot = async () => {
  let orders = [];
  let upTrend = false;
  let downTrend = false;
  let lastDownTrend = false;

  // LOAD LIST OF ORDERS
  await exchanges();
  await initExchange();
  const bal = await getExchange().fetchBalance();
  console.log(`BTC: ${bal?.free['BTC']}`);
  console.log(`USDT: ${bal?.free['USDT']}`);
  console.log(`USDC: ${bal?.free['USDC']}`);
  console.log(`TUSD: ${bal?.free['TUSD']}`);
  
  orders = await getExchange().fetchOpenOrders(state.symbol);
  console.log(`\x1b[1m\x1b[42mOPEN \x1b[91m ORDERS\x1b[104m`);  // 1m is bold, 0m is reset
  console.table(orders.map(i => i.info));
  for (let i in orders) {
    await cancelOrder(orders[i].id);
  }

  orders = await getExchange().fetchClosedOrders(state.symbol);
  console.log(`\x1b[45mCLOSED \x1b[93m ORDERS\x1b[101m`);  // 1m is bold, 0m is resets
  console.table(orders.map(i => i.info));
  //await getExchange().createOrder("BTC/USDC", "limit", "buy", 0.01, 29353);

  // WAIT FOR FIRST BTC PRICE
  while (state.curPrice === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
    continue;
  }
  if (state.lastPrice === 0)
    state.lastPrice = state.curPrice;
  
  // GET LAST BUY PRICE
  if (state.buyPrice === 0) {
    const buys = orders.filter(i => i.symbol === state.symbol && i.side === "buy" && new Date(i.datetime) > new Date().setDate( new Date().getDate() - 3 ));
    if (buys.length > 0)
      state.buyPrice = buys[buys.length-1].price;
    else
      state.buyPrice = state.curPrice;
    
    state.recentBuyPrices.push(state.buyPrice);
    state.buyPrice2 = state.buyPrice;
    console.log(`\x1b[1m\x1b[31mRESET\x1b[32m buy\x1b[33m price\x1b[34m to\x1b[35m last\x1b[36m ${state.buyPrice}\x1b[0m`);
  }
///////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
// LOOP
///////////////////////////////////////////////////////////
while (1) {
    oneLine(`\x1b[1m\x1b[45m${rightPad(Math.random(), 4)}`);

    // Wait x miliseconds
    await new Promise(resolve => setTimeout(resolve, 100));

    try
    {
      const [bal, orders] = await Promise.all( [
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

      ///////////////////////////////////////////////////////////
      // CANCEL BUY OR SELL ORDERS (every x minutes) ////////////
      ///////////////////////////////////////////////////////////
      await cancelOldOrders(orders, 120, "buy", "stop_loss_limit"); // ignore stoploss

      // if (await cancelOldOrders(orders, 150, "sell", "stop_loss_limit")) {
      //   state.buyPrice = latest;
      //   state.buyPrice2 = latest;
      //   oneLine(`\x1b[43mRSET`, twoDecimals(state.buyPrice), twoDecimals(state.curPrice),
      //     `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   ${state.balanceStr}\n`);
      // }

      const sells = orders.filter(i => i.symbol === state.symbol && i.side === "sell");
      if (sells.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      ///////////////////////////////////////////////////////////
      // BUY  ///////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////
      const buys = orders.filter(i => i.symbol === state.symbol && i.side === "buy");
      state.buyOrderCreated = buys.length > 0;

      if ( state.freeUsd >= state.curPrice * state.tradeSums[0]
        //&& state.curPrice < state.lastPrice
        //&& state.avgPrice > state.curPrice
        //&& !upTrend
        //&& !state.buyOrderCreated
        )
      {
        await new Promise(resolve => setTimeout(resolve, 1*60*1000)); // x minutes * 60 seconds * 1000 miliseconds

        state.buyPrice2 = state.buyPrice;
        state.buyPrice = state.curPrice - state.spread;

        state.recentBuyPrices.push(state.buyPrice);
        if(state.recentBuyPrices.length > 3)  // keep last x prices
          state.recentBuyPrices.shift();
      
        oneLine(`\x1b[42mBUY `, twoDecimals(state.buyPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}      ${state.balanceStr}\n`);

        try {
          // await getExchange().createMarketBuyOrder(state.symbol, state.tradeSums[0]);
          await Promise.all( [
              getExchange().createOrder(state.symbol, "limit", "buy", state.tradeSums[0], state.buyPrice)
            // , getExchange().createOrder(state.symbol, "limit", "sell", state.tradeSums[0], state.buyPrice + state.spread)
          ] );
          
          state.buyOrderCreated = true;

        } catch(e) {
          err(e?.message);
        }
      }

      ///////////////////////////////////////////////////////////
      // SELL ///////////////////////////////////////////////////
      ///////////////////////////////////////////////////////////
      if (state.freeBtc >= state.tradeSums[0])
      {
        let atPrice = Math.max(...state.recentBuyPrices);
        atPrice = atPrice + state.spread;
        
        oneLine(`\x1b[41mSELL`, twoDecimals(atPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}      ${state.balanceStr}\n`);

        await getExchange().createOrder(state.symbol, "limit", "sell", state.tradeSums[0], atPrice);
        // await getExchange().createMarketSellOrder(state.symbol, state.tradeSums[0]);

        await new Promise(resolve => setTimeout(resolve, 2*60*1000)); // 2 minutes
      }

/*
      ///////////////////////////////////////////////////////////
      // STOP LOSS
      ///////////////////////////////////////////////////////////
      const stopLoss = orders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
      state.stopLossOrder = stopLoss.length > 0;
      let stopPrice = latest-state.spread*2;

      if (state.stopLossOrder && stopPrice > state.stopPrice+3) {
        state.stopPrice = stopPrice;

        // EDIT STOP LOSS
        oneLine(`\x1b[4mEDIT`, twoDecimals(stopPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}\n`);

        const id = stopLoss[0].id;
        await getExchange().editOrder(id, state.symbol, "limit", "sell", state.tradeSums[0], stopPrice-10, {"stopPrice": stopPrice}); // stopPrice = Trigger Condition
      }

      if (1==2 && !state.stopLossOrder && state.freeBtc >= state.tradeSums[0]) {
        stopPrice = lowestPrice(-10, 10) - state.spread*4;
        state.stopPrice = stopPrice;
    
        // CREATE STOP LOSS
        oneLine(`\x1b[4mSTOP`, twoDecimals(stopPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}\n`);

        try {
          await getExchange().createOrder(state.symbol, "limit", "sell", state.tradeSums[0], stopPrice-10, {"stopPrice": stopPrice}); // stopPrice = Trigger Condition
        } catch(e) {
          err(e?.message);
        }
      }
*/


      // ///////////////////////////////////////////////////////////
      // // CANCEL STOP LOSS
      ///////////////////////////////////////////////////////////
      // if (state.stopLossOrder
      //   && state.avgPrice > state.buyPrice + state.spread / 2) // current price avarage ABOVE buy price plus half spread (WINNING TRADE)
      // {
      //   orders = await getExchange().fetchOpenOrders(state.symbol);
      //   const stopLoss = orders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
      //   for (let i in stopLoss) {
      //     await cancelOrder(stopLoss[i].id);
      //     state.stopLossOrder = false;
      //   }
      // }

      ///////////////////////////////////////////////////////////
      // Memorize last price
      state.lastPrice = state.curPrice;
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
export { mainRunSpot };
