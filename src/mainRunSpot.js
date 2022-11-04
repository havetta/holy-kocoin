import { runWebSocket } from "./webSocket.js";
import { isDownTrend } from "./priceTrends.js";
import { balance, fetchTicker, openOrders, positions } from "./services/balance.js";
import { cancelOldOrders, createOrder, cancelOrder, cancelAllOrders, createOrderStopPrice } from "./services/order.js";
import { state, getExchange, initExchange } from "./store.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./services/exchange.js";
import { log, table, sameline, warn, err, oneLine } from "./utils/logger.js";
import { twoDecimals, leftPad } from "./utils/formatter.js";

// GET PRICE OVER BINANCE WEBSOCKET
runWebSocket();

// USING CCXT
const mainRunSpot = async () => {

  await initExchange();
  const orders = await getExchange().fetchOpenOrders(state.symbol);

  let downTrend = false;
  let lastDownTrend = false;
  while (1) {
    oneLine(`\x1b[1m\x1b[45mTICK`);

    await new Promise(resolve => setTimeout(resolve, 100));

    if (state.price === 0)
      continue;

    try
    {
      const [bal] = await Promise.all([balance()]);

      if (state.lastPrice === 0)
        state.lastPrice = state.price;

      state.freeBtc = bal?.free[`BTC`];
      state.freeUsdt = bal?.free[`USDT`];
      const balanceStr = `BTC : ${leftPad(state.freeBtc, 8)}  USDT : ${leftPad(state.freeUsdt, 8)}`;

      const btcToBuy = Math.trunc(state.freeUsdt / state.price * 10000) / 10000;

      if (state.buyPrice === 0)
      {
        const orders = await getExchange().fetchClosedOrders(state.symbol);
        const buys = orders.filter(i => i.symbol === state.symbol && i.side === "buy" && new Date(i.datetime) > new Date().setDate( new Date().getDate() - 3 ));
        if (buys.length > 0)
          state.buyPrice = buys[buys.length-1].price;
        else
          state.buyPrice = state.price;
        console.log(`\x1b[1m\x1b[31mRESET\x1b[32m buy\x1b[33m price\x1b[34m to\x1b[35m last\x1b[36m ${state.buyPrice}\x1b[0m`);
      }

      lastDownTrend = downTrend;
      downTrend = isDownTrend();

      ///////////////////////////////////////////////////////////
      // CANCEL BUY ORDERS (every x seconds)
      cancelOldOrders();

      ///////////////////////////////////////////////////////////
      // BUY
      // if (state.freeUsdt >= 10 && downTrend && !lastDownTrend) {
      //   const lowerPrice = state.price < state.lastPrice ? state.price : state.lastPrice;
      //   state.buyPrice = lowerPrice - state.spread / 10;
      //   oneLine(`\x1b[42mBUY `, twoDecimals(state.buyPrice), twoDecimals(state.price), balanceStr + "\n");
      //   const stopLossPrice = state.price - state.spread * 10; //Math.trunc(state.price * 0.0006); // 0.06% = 20000 * 0.0006 = 12
      //   const takeProfPrice = state.price + state.spread * 10; //Math.trunc(state.price * 0.0001); // 0.01% = 20000 * 0.0001 = 2
      //   await getExchange().createMarketBuyOrder(state.symbol, state.tradeSum);
      //   // await createOrder("buy", state.tradeSum, state.buyPrice);
      //   state.buyOrderCreated = true;
      // }


      ///////////////////////////////////////////////////////////
      // SELL
      if (state.freeBtc >= state.tradeSum) {
        state.buyOrderCreated = false;

        if (state.avgPrice > state.buyPrice) { // current price avarage ABOVE buy price (WINNING TRADE)
          const currPrice = state.lastPrice - state.spread;

          if (state.buyPrice < currPrice
            || state.recentPrices[0] < currPrice
            || state.lastPrice < currPrice)
          {
            let higherPrice = state.price > state.lastPrice ? state.price : state.lastPrice;

            if (higherPrice <= state.buyPrice)
              higherPrice = state.buyPrice + state.spread / 3;
            oneLine(`\x1b[41mSELL`, twoDecimals(state.avgPrice), twoDecimals(state.price),
              `Recent: ${twoDecimals(state.recentPrices[0])}   Last: ${twoDecimals(state.lastPrice)}  stopLoss: ${state.stopLossOrder}           \n`);

            // await getExchange().createMarketSellOrder(state.symbol, state.tradeSum);
            await createOrder("sell", state.tradeSum, higherPrice);
          }
        }
        // STOP LOSS
        else
        {
          const orders = await getExchange().fetchOpenOrders(state.symbol);
          const sells = orders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
          if (sells.length === 0)
            state.stopLossOrder = false; // Reset stoploss flag needed, boolean value not consistent at all times

          if (!state.stopLossOrder
            && state.avgPrice < state.buyPrice) // current price avarage BELLOW buy price (LOSING TRADE)
          {
            if (sells.length === 0) {
              // CREATE STOP LOSS
              oneLine(`\x1b[4mSTOP`, twoDecimals(state.buyPrice), twoDecimals(state.price),
                `Recent: ${twoDecimals(state.recentPrices[0])}   ${balanceStr}           `);

              //await createOrderStopPrice("sell", state.tradeSum, state.avgPrice - state.spread * 15, state.avgPrice - state.spread * 14);
              //state.stopLossOrder = true;
            }
          }
        }
      }

      ///////////////////////////////////////////////////////////
      // CANCEL STOP LOSS
      if (state.stopLossOrder
        && state.avgPrice > state.buyPrice + state.spread / 2) // current price avarage ABOVE buy price plus half spread (WINNING TRADE)
      {
        const orders = await getExchange().fetchOpenOrders(state.symbol);
        const sells = orders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
        for (let i in sells) {
          await cancelOrder(sells[i].id);
          state.stopLossOrder = false;
        }
      }

      ///////////////////////////////////////////////////////////
      // Memorize last price
      state.lastPrice = state.avgPrice;
      state.recentPrices.push(state.price);
      if(state.recentPrices.length > 15)  // keep last x prices
        state.recentPrices.shift();
    }
    catch(e) {
      err(e?.message);
      // warn(e?.stack);
    }
  }
}

export { mainRunSpot };
