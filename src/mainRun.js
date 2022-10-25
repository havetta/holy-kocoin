import { balance, fetchTicker, openOrders, orderBook } from "./balance.js";
import { btcPrice } from "./coingecko.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./exchange.js";
import { log } from "./utils/logger.js";

const mainRun = async () => {

  log(`Trading ${process.env.symbol} on ${process.env.exchange}`);

  setInterval(async () => {
    //log(await btcPrice(`bitcoin`));
    const t = await fetchTicker();
    log(t.last);
  }, 1000);
}

export { mainRun };
