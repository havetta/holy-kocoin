import { balance, fetchTicker, openOrders, positions } from "./balance.js";
import { cancelOldOrders, createOrder, createOrderStopPrice } from "./order.js";
import { setInitialState, state } from "./store.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./exchange.js";
import { log, table, sameline, warn, err } from "./utils/logger.js";

const mainRunSpot = async () => {

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
        state.lastPrice = price;
      const priceWith2decimals = `${price}.${(new String(ticker?.last*100 - price*100) + "00").substring(0,2)}`;

      const freeBtc = bal?.free[`BTC`];
      const freeUsdt = bal?.free[`USDT`];
      const balanceStr = `BTC:${new String(freeBtc).padStart(7," ")} USDT:${new String(freeUsdt).padStart(7," ")}`;

      const btcToBuy = Math.trunc(freeUsdt / price * 10000) / 10000;

      if (state.buyPrice === 0)
      {
        state.buyPrice = price;
        console.log(`\x1b[1m\x1b[31mRESET\x1b[32m buy\x1b[33m price\x1b[34m to\x1b[35m current\x1b[36m ${ticker?.last}\x1b[0m`);
      }

      oneLine(`wait`, state.lastPrice, priceWith2decimals, balanceStr);
      

      ///////////////////////////////////////////////////////////
      // CANCEL BUY ORDERS (every x seconds)
      cancelOldOrders();

      ///////////////////////////////////////////////////////////
      // BUY
      if (freeUsdt >= 11) {
        state.buyPrice = price < state.lastPrice ? price : state.lastPrice;
        state.buyPrice = state.buyPrice - 3;
        oneLine(`\x1b[42mBUY `, state.buyPrice, priceWith2decimals, balanceStr + "\n");

        // const stopLossPrice = price - 300;//Math.trunc(price * 0.0006); // 0.06% = 20000 * 0.0006 = 12
        // const takeProfPrice = price + 300;//Math.trunc(price * 0.0001); // 0.01% = 20000 * 0.0001 = 2
        await createOrder("buy", 0.0005, state.buyPrice);
  
        state.buyOrderCreated = true;
      }

      ///////////////////////////////////////////////////////////
      // SELL
      if (freeBtc >= 0.0005) {
        let higherPrice = price > state.lastPrice ? price : state.lastPrice;
        ++higherPrice;
        oneLine(`\x1b[41mSELL`, higherPrice, priceWith2decimals, balanceStr + "\n");

        await createOrder("sell", 0.0005, higherPrice);
      }

      ///////////////////////////////////////////////////////////
      // Memorize last price
      state.lastPrice = Math.trunc(ticker?.last);
    }
    catch(e) {
      err(e?.message);
      warn(e?.stack);
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export { mainRunSpot };
