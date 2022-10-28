import { balance, fetchTicker, openOrders, positions } from "./balance.js";
import { createOrder } from "./order.js";
import { getState } from "./store.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./exchange.js";
import { log, sameline } from "./utils/logger.js";

const mainRun = async () => {

  log(`Trading ${process.env.symbol} on ${process.env.exchange}`);

  setInterval(async () => {
    try
    {

      const [ticker, bal] = await Promise.all([fetchTicker(), balance()]);

      const price = Math.trunc(ticker?.last)

      const btc = bal.free[`BTC`];
      const usdt = bal.free[`USDT`];

      const state = getState();

      const btcAmount = Math.trunc(usdt / price * 10000) / 10000;

      if (!state.buyOrderCreated && usdt > 140 || btc === 0)
      {
        log(`Buy: ${btcAmount} .... Buy price ${state.lastPrice} .... Price now: ${price} .... Balance: BTC:${btc} USDT:${usdt}`);
        
        await createOrder("buy", 0.001, price-1);
        state.lastPrice = price;
        state.buyOrderCreated = true
      }
      else
      {
        sameline(`NONE: ${btcAmount} .... Buy price ${state.lastPrice} .... Price now: ${price} .... Balance: BTC:${btc} USDT:${usdt}`);
      }

      if (state.buyOrderCreated && btc >= 0.001)
      {
        const sellPrice = state.lastPrice + 3;
        log(`Sell: ${btcAmount} .... sellPrice ${sellPrice} .... Price now: ${price} .... Balance: BTC:${btc} USDT:${usdt} !!!!!!!!!!!!`);
        await createOrder("sell", 0.001, sellPrice);
        state.buyOrderCreated = false;

      }
      // getOrder price and set to state
      // const o = await openOrders();
      // log(o);
      // const p = await positions();
      // log(p);
    }
    catch(e) {
      log(`Error:`);
      log(e);
    }
  }, 1000);
}

export { mainRun };
