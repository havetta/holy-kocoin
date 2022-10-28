import { balance, fetchTicker, openOrders, positions } from "./balance.js";
import { createOrder } from "./order.js";
import { setInitialState, getState } from "./store.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./exchange.js";
import { log, sameline } from "./utils/logger.js";

const mainRun = async () => {
  await setInitialState();

  setInterval(async () => {
    try
    {
      const state = getState();

      // Load currect BTC ticker price + Load free USDT and BTC balance
      const [ticker, bal] = await Promise.all([fetchTicker(), balance()]);

      const price = Math.trunc(ticker?.last)

      const freeBtc = bal?.free[`BTC`];
      const freeUsdt = bal?.free[`USDT`];

      const btcToBuy = Math.trunc(freeUsdt / price * 10000) / 10000;

      if (state.buyPrice === 0)
      {
        state.buyPrice = price;

        log(`RESET buyPrice: ${state.buyPrice}`);
      }

      ///////////////////////////////////////////////////////////
      if (state.buyOrderCreated)
      {
        const orders = await openOrders();
        const buys = orders.filter(i => i.side === "buy" && i.symbol === state.symbol);
        
        let buyOrderLog = ``;
        state.buyOrderCreated = false;
        if (buys.length > 0)
        {
          state.buyOrderCreated = true;
          buyOrderLog = `.... buy order at: ${buys?.[0]?.price}`;
        }

        sameline(`wait for buy at  ${buys?.[0]?.price} .... Price now: ${price} .... Balance: BTC:${freeBtc} USDT:${btcToBuy} ${buyOrderLog}`);      }
      
      ///////////////////////////////////////////////////////////
      else if (!state.buyOrderCreated && freeBtc === 0 && btcToBuy > 0)
      {
        state.buyOrderCreated = true
        state.buyPrice = price - 1;
        
        await createOrder("buy", 0.001, state.buyPrice);

        log(`.BUY:  Buy price ${state.buyPrice} .... Price now: ${price} .... Balance: BTC:${freeBtc} USDT:${btcToBuy}               `);
      }

      ///////////////////////////////////////////////////////////
      else if (freeBtc > 0)
      {
        const sellPrice = state.buyPrice + 2;
        log(`SELL: Sell price ${sellPrice} .... Price now: ${price} .... Balance: BTC:${freeBtc} USDT:${btcToBuy} !!!!!!!!!!!!`);
        await createOrder("sell", 0.001, sellPrice);
        state.buyOrderCreated = false;
      }
      else
      {
        sameline(`ELSE: Last price ${state.lastPrice} .... Price now: ${price}                                       `);
      }

      state.lastPrice = price;
    }
    catch(e) {
      log(`Error:`);
      log(e);
      log(e?.message);
      log(e?.stack);
    }
  }, 1000);
}

export { mainRun };
