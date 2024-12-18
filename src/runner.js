import { runWebSocket } from "./webSocket.js";
// import { express } from "./server.js";
import { highestPrice, lowestPrice, recentPriceAvg, isDownTrend, isUpTrend } from "./utils/priceTrends.js";
import { doBuy, doSell, cancelOldOrders, cancelOrder, cancelAllOrders, createOrderStopPrice } from "./utils/order.js";
import { conf, state, getExchange, initExchange } from "./store.js";
import { log, table, sameline, warn, err, oneLine } from "./utils/logger.js";
import { twoDecimals, leftPad, rightPad } from "./utils/formatter.js";

let _sinceBuyCount = 150;

// await cancelOldOrders(await getExchange().fetchOpenOrders(state.symbol), 2, "buy", "stop_loss_limit");
// await getExchange().createOrder(`BTC/TUSD`, "limit", "sell", 0.0043976, 43288);

// /////////////////////////////////////////////////////////
//!  GET PRICE OVER BINANCE WEBSOCKET
// /////////////////////////////////////////////////////////
await initExchange();
runWebSocket();
// /////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////
//!  START WEB SERVER
// /////////////////////////////////////////////////////////
// express.get('/', async (req, reply) => { return `eval(req.query?.eval)`; });
// /////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////
//!  READ STDIN
// /////////////////////////////////////////////////////////
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (d) => {
  try {
    console.log(`\n${d}`);
    switch (d[0]) {
      case `0`:
        break;
      case `1`:
        console.log(`freeUsd: ${state.freeUsd}      freeBtc: ${state.freeBtc}`);
        getExchange().createOrder(state.symbol, "limit", "buy", 0.02, state.curPrice);
        break;
      case `2`:
        console.log(`freeUsd: ${state.freeUsd}      freeBtc: ${state.freeBtc}`);
        getExchange().createOrder(state.symbol, "limit", "sell", state.freeBtc, state.curPrice);
        break;
      case `3`:
        console.log(`freeUsd: ${state.freeUsd}      freeBtc: ${state.freeBtc}`);
        await cancelOldOrders(await getExchange().fetchOpenOrders(state.symbol), 0, "buy", "stop_loss_limit");
        break;
      case `4`:
        console.log(`freeUsd: ${state.freeUsd}      freeBtc: ${state.freeBtc}`);
        await cancelOldOrders(await getExchange().fetchOpenOrders(state.symbol), 0, "sell", "stop_loss_limit");
        break;
      case `9`:
        console.log(`freeUsd: ${state.freeUsd}      freeBtc: ${state.freeBtc}`);
        getExchange().createOrder(`BTCUSDT`, "limit", "buy", 12, state.curPrice);
        break;
      case `-`:
        break;
      case `=`:
        const exchangeInfo = await state.exchange.exchangeInfo({ symbol: state.symbol});
        console.log(exchangeInfo);
        break;
      case `[`:
        break;
      case `]`:
        break;
      case `;`:
        break;
      case `'`:
        break;
      case `/`:
        break;
      case `!`:
        state.exchange.setLeverage(3, 'BTCUSD');
        break;
      case `.`:
        console.log(`freeUsd: ${state.freeUsd}      freeBtc: ${state.freeBtc}`);
        console.table(
          state.openOrders.map((i) => {
            return { datetime: i.datetime, side: i.side, price: i.price, amount: i.amount, usd: i.price * i.amount, status: i.status };
          })
        );
        break;
      case `_`:
        console.log(eval(`${d}\n`));
        break;
      default:
        console.log(eval(`state.${d}\n`));
    }
  } catch (e) {
    err(e?.message);
  }
});
// /////////////////////////////////////////////////////////
while (1) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
// /////////////////////////////////////////////////////////
//!  INITIALIZATION
// /////////////////////////////////////////////////////////
const runner = async () => {
  // LOAD LIST OF ORDERS
  const bal = await getExchange().fetchBalance();
  console.log(`USDT: ${bal?.free["USDT"]}      BTC: ${bal?.free["BTC"]}`);
  // console.log(`ETH: ${bal?.free["ETH"]}`);
  // console.log(`SOL: ${bal?.free["SOL"]}`);
  // console.log(`USDT: ${bal?.free["USDT"]}`);
  // console.log(`USDC: ${bal?.free["USDC"]}`);
  // console.log(`FDUSD: ${bal?.free["FDUSD"]}`);

  state.openOrders = await getExchange().fetchOpenOrders(state.symbol);
  state.buyOrders = state.openOrders.filter((i) => i.side === "buy" && i.type != "stop_loss_limit");
  if (state.openOrders.length > 0) {
    console.log(`\x1b[1m\x1b[42mOPEN \x1b[91m ORDERS\x1b[104m`); // 1m is bold, 0m is reset
    console.table(
      state.openOrders.map((i) => {
        return { datetime: i.datetime, side: i.side, price: i.price, amount: i.amount, usd: i.price * i.amount, status: i.status };
      })
    );
  }

  // const closedOrders = await getExchange().fetchClosedOrders(state.symbol);
  // console.log(`\x1b[45mCLOSED \x1b[93m ORDERS\x1b[101m`);  // 1m is bold, 0m is resets
  // console.table(closedOrders.map(i => { return { datetime: i.datetime, side: i.side, price: i.price, amount: i.amount, usd: i.price*i.amount, status: i.status }; }));

  // WAIT FOR FIRST PRICE
  while (state.curPrice === 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    continue;
  }
  if (state.lastPrice === 0) state.lastPrice = state.curPrice;

  // GET LAST BUY PRICE
  if (state.buyPrice === 0) {
    state.buyPrice = state.openOrders?.[0]?.price ?? state.curPrice;
    state.recentBuyPrices.push(state.buyPrice);
    console.log(`\x1b[1m\x1b[31mRESET\x1b[32m buy\x1b[33m price\x1b[34m to\x1b[35m last\x1b[36m ${state.buyPrice}\x1b[0m`);
  }

  //TODO /////////////////////////////////////////////////////////
  //!    MAIN LOOP ///////////////////////////////////////////////
  //TODO /////////////////////////////////////////////////////////
  while (1) {
    oneLine(`\x1b[1m\x1b[45m${rightPad(_sinceBuyCount, 5)}`);

    // Wait x miliseconds
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const [bal, openOrders] = await Promise.all([getExchange().fetchBalance(), getExchange().fetchOpenOrders(state.symbol)]);
      state.openOrders = openOrders;

      const pairBTC = state.symbol.split("/")[0];
      const pairUSD = state.symbol.split("/")[1];
      state.freeBtc = bal?.free[pairBTC];
      state.freeUsd = bal?.free[pairUSD];
      state.balanceStr = `${pairBTC} : ${leftPad(state.freeBtc, 8)}  ${pairUSD} : ${leftPad(state.freeUsd, 8)}`;

      //? /////////////////////////////////////////////////////////
      //!  CANCEL BUY OR SELL ORDERS (every x minutes) ////////////
      //? /////////////////////////////////////////////////////////
      // if (await cancelOldOrders(state.openOrders, 150, "sell", "stop_loss_limit")) {
      //   oneLine(`\x1b[43mRESET`, twoDecimals(state.buyPrice), twoDecimals(state.curPrice),
      //     `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent5: ${twoDecimals(recentPriceAvg(-15, 15))}   ${state.balanceStr}\n`);
      // }
      // const sells = state.openOrders.filter(i => i.symbol === state.symbol && i.side === "sell");
      // if (sells.length > 0) {
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      // }

      //* /////////////////////////////////////////////////////////
      //*  BUY  ///////////////////////////////////////////////////
      //* /////////////////////////////////////////////////////////
      let hour = new Date().getHours();
      let setAmount = state.smallestAmount; // * conf.multiplyBy[hour];
      // const exName = conf.exchangeName[conf.usr];
      const calculatedBuyPrice = Math.min(...state.recentPrices /*state.lastPrice, state.curPrice*/); // + (exName === "bybit" ? 20 : 30); // + X => websocket price difference should be corrected

      const specificHours = [4, 5, 6, 7, 8, 9, 10, 11, 12];
      if (
        state.freeUsd >= calculatedBuyPrice * setAmount
        // && specificHors.includes(hour)
        && _sinceBuyCount > state.buyEveryXSeconds
        // && state.avgPrice > state.curPrice
        // && !isUpTrend()
      ) {
        _sinceBuyCount = 0;

        state.buyPrice = calculatedBuyPrice;

        oneLine(`\x1b[42mBUY  `, twoDecimals(state.buyPrice), twoDecimals(state.curPrice), `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent15: ${twoDecimals(recentPriceAvg(-15, 15))}   ${state.balanceStr}\n`);

        try {
          // await getExchange().ceateMarketBuyOrder(state.symbol, setAmount);
          const newOrder = await getExchange().createOrder(state.symbol, "limit", "buy", setAmount, state.buyPrice);
          newOrder.amount = setAmount;
          newOrder.price = state.buyPrice;

          // TODO state.buyOrders.push(newOrder);

          state.buyOrderCreated = true;

          state.recentBuyPrices.push(state.buyPrice);
          if (state.recentBuyPrices.length > 5)
            // keep last x prices
            state.recentBuyPrices.shift();
        } catch (e) {
          err(e?.message);
        }
      }

      //! /////////////////////////////////////////////////////////
      //!  SELL ///////////////////////////////////////////////////
      //! /////////////////////////////////////////////////////////
      // state.buyOrders = await cancelOldOrders(state.buyOrders, 120, "buy", "stop_loss_limit"); // ignore stoploss
      state.realizedBuyOrders = state.buyOrders.filter((i) => !state.openOrders.some((open) => open.id === i.id));

      if (
          state.freeBtc >= state.smallestAmount
        && state.openOrders.length === 0
        // && state.openOrders.length === 0
      ) {
        _sinceBuyCount = 0;

        const sellAt = /* TODO realized.price*/ Math.max(...state.recentBuyPrices) + state.spread;
        // await getExchange().createMarketSellOrder(state.symbol, state.smallestAmount);
        // TODO for (let realized of state.realizedBuyOrders) {
        // oneLine(`\x1b[41mSELL `, twoDecimals(sellAt), twoDecimals(state.curPrice), `Recent0-5: ${twoDecimals(recentPriceAvg(0, 15))}   recent15: ${twoDecimals(recentPriceAvg(-15, 15))}   ${state.balanceStr}\n`);

        // await getExchange().createOrder(state.symbol, "limit", "sell", state.smallestAmount, sellAt);
        // TODO await getExchange().createOrder(state.symbol, "limit", "sell", realized.amount, realized.price + state.spread);
        // TODO state.buyOrders = state.buyOrders.filter(i => i.id !== realized.id);
        //}
      }

      /*
      //? /////////////////////////////////////////////////////////
      //?  STOP LOSS
      //? /////////////////////////////////////////////////////////
      const stopLoss = state.openOrders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
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
      //   state.openOrders = await getExchange().fetchOpenOrders(state.symbol);
      //   const stopLoss = state.openOrders.filter(i => i.symbol === state.symbol && i.side === "sell" && i.type === "stop_loss_limit");
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
      if (state.openOrders.length > 0) {
        _sinceBuyCount++;
      }
    } catch (e) {
      if (e?.message != `binance Stop price would trigger immediately.`) err(e?.message);
      // warn(e?.stack);
    }
  }
};
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export { runner };
