import { runWebSocket } from "./webSocket.js";
import { isDownTrend, recentPriceAvg } from "./priceTrends.js";
import { balance, fetchTicker, openOrders, positions } from "./services/balance.js";
import { cancelOldOrders, createOrder, cancelOrder, cancelAllOrders, createOrderStopPrice } from "./services/order.js";
import { state, getExchange, initExchange } from "./store.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./services/exchange.js";
import { log, table, sameline, warn, err, oneLine } from "./utils/logger.js";
import { twoDecimals, leftPad } from "./utils/formatter.js";

// TOP LEVEL AWAIT WORKAROUNT
const runner = async () => {


  let orders = [];
  let downTrend = false;
  let lastDownTrend = false;

  // LOAD LIST OF ORDERS
  await initExchange();
  orders = await getExchange().fetchClosedOrders(state.symbol);

  // WAIT FOR FIRST BTC PRICE
  while (state.price === 0) {
    // Wait x miliseconds
    await new Promise(resolve => setTimeout(resolve, 100));
    continue;
  }
  if (state.lastPrice === 0)
    state.lastPrice = state.price;

  // GET LAST BUY PRICE
  if (state.buyPrice === 0) {
    const buys = orders.filter(i => i.symbol === state.symbol && i.side === "buy" && new Date(i.datetime) > new Date().setDate( new Date().getDate() - 3 ));
    if (buys.length > 0)
      state.buyPrice = buys[buys.length-1].price;
    else
      state.buyPrice = state.price;

    console.log(`\x1b[1m\x1b[31mRESET\x1b[32m buy\x1b[33m price\x1b[34m to\x1b[35m last\x1b[36m ${state.buyPrice}\x1b[0m`);
  }



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

      ///////////////////////////////////////////////////////////
      // CANCEL BUY ORDERS (every x seconds)
      // cancelOldOrders();

      ///////////////////////////////////////////////////////////
      // BUY
      const buys = orders.filter(i => i.symbol === state.symbol && i.side === "buy");
      if (buys.length > 0) {
        state.buyPrice = buys[buys.length-1].price;
      } else {
        const lowerPrice = state.price < state.lastPrice ? state.price : state.lastPrice;
        state.buyPrice = lowerPrice - state.spread * 2;
        
        oneLine(`\x1b[42mBUY `, twoDecimals(state.buyPrice), twoDecimals(state.price),
          `Recent: ${twoDecimals(recentPriceAvg(0, 5))}   Last: ${twoDecimals(state.lastPrice)}                           \n`);

        // const stopLossPrice = state.price - state.spread * 10; //Math.trunc(state.price * 0.0006); // 0.06% = 20000 * 0.0006 = 12
        // const takeProfPrice = state.price + state.spread * 10; //Math.trunc(state.price * 0.0001); // 0.01% = 20000 * 0.0001 = 2
        // await getExchange().createMarketBuyOrder(state.symbol, state.tradeSum);
        await createOrder("buy", state.tradeSum, state.buyPrice);
        state.buyOrderCreated = true;
      }


      ///////////////////////////////////////////////////////////
      // SELL
      if (1==1) {
/*
      if (state.freeBtc >= state.tradeSum) {
        state.buyOrderCreated = false;
        if (state.avgPrice > state.buyPrice) { // current price avarage ABOVE buy price (WINNING TRADE)
          const currPrice = state.lastPrice - state.spread;

          if (state.buyPrice < currPrice
            || recentPriceAvg(0, 5) < currPrice
            || state.lastPrice < currPrice)
          {
            let higherPrice = state.price > state.lastPrice ? state.price : state.lastPrice;

            if (higherPrice <= state.buyPrice) {
              higherPrice = state.buyPrice + state.spread / 3;
            }

            oneLine(`\x1b[41mSELL`, twoDecimals(state.avgPrice), twoDecimals(state.price),
              `Recent: ${twoDecimals(recentPriceAvg(0, 5))}   Last: ${twoDecimals(state.lastPrice)}  stopLoss: ${state.stopLossOrder}           \n`);

            //await createOrder("sell", state.tradeSum, higherPrice);
            await getExchange().createMarketSellOrder(state.symbol, state.tradeSum);

            // Wait x seconds
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        // STOP LOSS
        else*/
        {
          // orders = await getExchange().fetchOpenOrders(state.symbol);
          const sells = orders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
          if (sells.length === 0)
            state.stopLossOrder = false; // Reset stoploss flag needed, boolean value not consistent at all times

          if (!state.stopLossOrder)
            // && state.avgPrice < state.buyPrice) // current price avarage BELLOW buy price (LOSING TRADE)
          {
            if (sells.length === 0) {
              // CREATE STOP LOSS
              oneLine(`\x1b[4mSTOP`, twoDecimals(state.buyPrice), twoDecimals(state.price),
                `Recent: ${twoDecimals(recentPriceAvg(0, 5))}   ${balanceStr}           `);

              const lowerPrice = state.price < state.lastPrice ? state.price : state.lastPrice;
              await createOrderStopPrice("sell", state.tradeSum, lowerPrice - state.spread, lowerPrice - state.spread);
              state.stopLossOrder = true;
            }
          }
        }
      }

      // ///////////////////////////////////////////////////////////
      // // CANCEL STOP LOSS
      // if (state.stopLossOrder
      //   && state.avgPrice > state.buyPrice + state.spread / 2) // current price avarage ABOVE buy price plus half spread (WINNING TRADE)
      // {
      //   orders = await getExchange().fetchOpenOrders(state.symbol);
      //   const sells = orders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
      //   for (let i in sells) {
      //     await cancelOrder(sells[i].id);
      //     state.stopLossOrder = false;
      //   }
      // }

      ///////////////////////////////////////////////////////////
      // Memorize last price
      state.lastPrice = state.avgPrice;
      state.recentPrices.push(state.price);
      if(state.recentPrices.length > 10)  // keep last x prices
        state.recentPrices.shift();
    }
    catch(e) {
      err(e?.message);
      // warn(e?.stack);
    }
  }
}

export { runner };
