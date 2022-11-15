import { runWebSocket } from "./webSocket.js";
import { highestPrice, lowestPrice, recentPriceAvg, isDownTrend, isUpTrend } from "./helpers/priceTrends.js";
import { balance, fetchTicker, openOrders, positions } from "./services/balance.js";
import { cancelOldOrders, createOrder, cancelOrder, cancelAllOrders, createOrderStopPrice } from "./services/order.js";
import { state, getExchange, initExchange } from "./store.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./services/exchange.js";
import { log, table, sameline, warn, err, oneLine } from "./utils/logger.js";
import { twoDecimals, leftPad } from "./utils/formatter.js";

///////////////////////////////////////////////////////////
// GET PRICE OVER BINANCE WEBSOCKET
runWebSocket();
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// TOP LEVEL AWAIT WORKAROUNT
const mainRunSpot = async () => {
  let orders = [];
  let upTrend = false;
  let downTrend = false;
  let lastDownTrend = false;

  // LOAD LIST OF ORDERS
  await initExchange();
  orders = await getExchange().fetchClosedOrders(state.symbol);

  // WAIT FOR FIRST BTC PRICE
  while (state.curPrice === 0) {
    // Wait x miliseconds
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

    console.log(`\x1b[1m\x1b[31mRESET\x1b[32m buy\x1b[33m price\x1b[34m to\x1b[35m last\x1b[36m ${state.buyPrice}\x1b[0m`);
  }
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// LOOP
  while (1) {
    oneLine(`\x1b[1m\x1b[45mTICK`);

    // Wait x miliseconds
    await new Promise(resolve => setTimeout(resolve, 100));

    try
    {
      // const [bal] = await Promise.all([balance()]);
      const [bal, orders] = await Promise.all([balance(), getExchange().fetchOpenOrders(state.symbol)]);


      state.freeBtc = bal?.free[`BTC`];
      state.freeUsdt = bal?.free[`USDT`];
      const balanceStr = `BTC : ${leftPad(state.freeBtc, 8)}  USDT : ${leftPad(state.freeUsdt, 8)}`;


      lastDownTrend = downTrend;
      downTrend = isDownTrend();
      upTrend = isUpTrend();

      let latest = state.curPrice < state.lastPrice ? state.curPrice : state.lastPrice;

      const buys = orders.filter(i => i.symbol === state.symbol && i.side === "buy");
      const stopLoss = orders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");

      ///////////////////////////////////////////////////////////
      // CANCEL BUY ORDERS (every x seconds)
      if (await cancelOldOrders(orders)) {
        state.buyPrice = latest;
        oneLine(`\x1b[43mRSET`, twoDecimals(state.buyPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}\n`);
      }

      ///////////////////////////////////////////////////////////
      // BUY
      state.buyOrderCreated = buys.length > 0;
      
      if (downTrend &&  
          !state.buyOrderCreated && 
          state.freeUsdt >= state.avgPrice * state.tradeSums[0])
      {
        state.buyPrice = latest;
        
        oneLine(`\x1b[42mBUY `, twoDecimals(state.buyPrice), twoDecimals(state.curPrice),
          `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}\n`);

        try {
          // await getExchange().createMarketBuyOrder(state.symbol, state.tradeSums[0]);
          await getExchange().createOrder(state.symbol, "limit", "buy", state.tradeSums[0], state.buyPrice);
          state.buyOrderCreated = true;
        } catch(e) {
          err(e?.message);
        }
      }

      ///////////////////////////////////////////////////////////
      // STOP LOSS
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

      ///////////////////////////////////////////////////////////
      // SELL

      if (state.freeBtc >= state.tradeSums[0]) {
        let atPrice = state.curPrice < state.lastPrice ? state.lastPrice : state.curPrice;
        atPrice = +atPrice + +state.spread;
        
        if (!upTrend && state.buyPrice < atPrice) {

          oneLine(`\x1b[41mSELL`, twoDecimals(atPrice), twoDecimals(state.curPrice),
            `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   Buy: ${twoDecimals(state.buyPrice)}\n`);

          await createOrder("sell", state.tradeSums[0], atPrice);
          // await getExchange().createMarketSellOrder(state.symbol, state.tradeSums[0]);

          // Wait x seconds
          // await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }


      // ///////////////////////////////////////////////////////////
      // // CANCEL STOP LOSS
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
