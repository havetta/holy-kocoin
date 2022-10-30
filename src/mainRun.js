import { balance, fetchTicker, openOrders, positions } from "./balance.js";
import { cancelOldOrders, createOrder, createOrderStopPrice } from "./order.js";
import { setInitialState, state } from "./store.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./exchange.js";
import { log, table, sameline, warn, err } from "./utils/logger.js";

const mainRun = async () => {

  function oneLine(first, msg1, msg2, msg3) {
    let msg = first;
    msg += ` \x1b[1m\x1b[44m`;
    msg += ` At price \x1b[43m${msg1}\x1b[44m ....`;
    msg += ` Price now: \x1b[45m${msg2}\x1b[44m ....`;
    msg += ` Balance: ${msg3} ....`;
    process.stdout.write(`${msg}\x1b[m\r`);
  }

  await setInitialState();

  while (1) {
    try
    {
      // Load currect BTC ticker price + Load free USDT and BTC balance
      const [ticker, bal] = await Promise.all([fetchTicker(), balance()]);

      const price = Math.trunc(ticker?.last)
      if (state.lastPrice === 0)
        state.lastPrice = Math.trunc(ticker?.last);

      const freeBtc = bal?.free[`BTC`];
      const freeUsdt = bal?.free[`USDT`];

      const btcToBuy = Math.trunc(freeUsdt / price * 10000) / 10000;

      if (state.buyPrice === 0)
      {
        state.buyPrice = price ;
        console.log("\x1b[1m%s\x1b[0m", `RESET buyPrice: ${state.buyPrice}`);
        console.log("\x1b[31m%s\x1b[0m", `RESET buyPrice: ${state.buyPrice}`);
        console.log("\x1b[32m%s\x1b[0m", `RESET buyPrice: ${state.buyPrice}`);
        console.log("\x1b[33m%s\x1b[0m", `RESET buyPrice: ${state.buyPrice}`);
        console.log("\x1b[34m%s\x1b[0m", `RESET buyPrice: ${state.buyPrice}`);
        console.log("\x1b[35m%s\x1b[0m", `RESET buyPrice: ${state.buyPrice}`);
        console.log("\x1b[36m%s\x1b[0m", `RESET buyPrice: ${state.buyPrice}`);
      }

      oneLine(`wait`, state.lastPrice, Math.trunc(ticker?.last*100), `BTC:${freeBtc} USDT:${freeUsdt}`);
      

      ///////////////////////////////////////////////////////////
      // CANCEL BUY ORDERS (every x seconds)
      cancelOldOrders();

      // ///////////////////////////////////////////////////////////
      if (freeUsdt >= 11) {
        // const orders = await openOrders();
        // const buys = orders.filter(i => i.side === "buy" && i.symbol === state.symbol);
        
        // let buyOrderLog = ``;
        // state.buyOrderCreated = false;
        // if (buys.length > 0)
        // {
        //   state.buyOrderCreated = true;
        //   buyOrderLog = `.... buy order at: ${buys?.[0]?.price}`;
        // } 

        state.buyPrice = price < state.lastPrice ? price : state.lastPrice;
        state.buyPrice = state.buyPrice - 3;
        oneLine(`\x1b[42m.BUY`, state.buyPrice, Math.trunc(ticker?.last*100), `BTC:${freeBtc} USDT:${freeUsdt}\n`);

        // const stopLossPrice = price - 300;//Math.trunc(price * 0.0006); // 0.06% = 20000 * 0.0006 = 12
        // const takeProfPrice = price + 300;//Math.trunc(price * 0.0001); // 0.01% = 20000 * 0.0001 = 2
        await createOrder("buy", 0.0005, state.buyPrice);
  
        state.buyOrderCreated = true;
      }

      ///////////////////////////////////////////////////////////
      if (freeBtc >= 0.0005) {
        let higherPrice = price > state.lastPrice ? price : state.lastPrice;
        ++higherPrice;
        oneLine(`\x1b[41mSELL`, higherPrice, Math.trunc(ticker?.last*100), `BTC:${freeBtc} USDT:${freeUsdt}\n`);

        await createOrder("sell", 0.0005, higherPrice);
      }

      // ///////////////////////////////////////////////////////////
      // else if (freeBtc > 0) {
      //   const sellPrice = state.buyPrice + 20;
      //   log(`SELL: Sell price ${sellPrice} .... Price now: ${price} .... Balance: BTC:${freeBtc} USDT:${btcToBuy} !!!!!!!!!!!!`);
      //   await createOrder("sell", 0.008, sellPrice);
      //   state.buyOrderCreated = false;
      // }
      // else {
      //   sameline(`ELSE: Last price ${state.lastPrice} .... Price now: ${price}                                       `);
      // }

      state.lastPrice = Math.trunc(ticker?.last);
    }
    catch(e) {
      err(e?.message);
      //warn(e?.stack);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export { mainRun };
