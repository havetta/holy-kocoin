import ccxt from "ccxt"
import { btcPrice } from "./coingecko.js";
import { exchanges, fetchMarkets, kukoinZeroFees } from "./exchange.js";
import { log } from "./utils/logger.js";

const mainRun = async () => {

  log(process.env.exchange)


  // fetchMarkets();

  kukoinZeroFees();

  setInterval(async () => {
    log(await btcPrice(`bitcoin`));
  }, 5000);
}

export { mainRun };
