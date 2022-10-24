import { balance, orderBook } from "./balance.js";
import { btcPrice } from "./coingecko.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./exchange.js";
import { log } from "./utils/logger.js";

const mainRun = async () => {

  log(`Trading ${process.env.symbol} on ${process.env.exchange}`);

  balance();

  // fetchMarkets();

  // kukoinZeroFees();

  // setInterval(async () => {
  //   log(await btcPrice(`bitcoin`));
  // }, 5000);
}

export { mainRun };
