import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import minimist from "minimist";
import dotenv from "dotenv";
dotenv.config();
const cliArgs = minimist(process.argv.slice(2));
const usr = cliArgs?._?.[0] ?? `a`;

class Client {
  constructor() {
    this.apiKey = process.env[`${usr}-phemk`];
    this.apiSecret = process.env[`${usr}-phems`];
    this.baseUrl = "https://api.phemex.com";
  }

  async signedRequest(endpoint, params = {}, method = "GET") {
    try {
      const headers = { "x-phemex-request-signature": this.apiKey, "Content-Type": "application/json", };
      const parameters = { ...params, timestamp: Date.now(),  };
      const queryStr = querystring.stringify(parameters);
      const signature = crypto.createHmac("sha256", this.apiSecret).update(queryStr).digest("hex");
      parameters.signature = signature;

      const url = `${endpoint.startsWith('http') ? endpoint : this.baseUrl}/${endpoint}`;
      const response = await axios({ method: method, url: `${url}`, headers: headers, params: parameters, });
      return response?.data;
    }
    catch (error) {
      if (error.response) {
        console.log("Error Code:", error.response.data.code || "N/A");
        console.log("Error Message:", error.response.data.msg || "N/A");
        console.log("Response:", error.response.data);
      } else if (error.request) {
        console.log("Request error:", error.request);
      } else {
        console.log(error.message);
      }
      return null;
    }
  }

  async ticker({ symbol = 'BTCUSDT' }) {
    return this.signedRequest('public/md/ticker', { symbol }, 'GET');
  }

  async account(params) {
    return this.signedRequest('accounts/accountPositions', params, 'GET');
  }

  async openOrders({ symbol = 'BTCUSDT' }) {
    return this.signedRequest('margin-trade/orders', { symbol }, 'GET');
  }

  async cancelAllOrders({ symbol = 'BTCUSDT' }) {
    return this.signedRequest('margin-trade/orders/all', { symbol }, 'DELETE');
  }

  async order({ symbol = 'BTCUSDT', side = 'BUY', type = 'LIMIT_MAKER', quantity, price, takeProfit }) {
    const params = { symbol, price, quantity, side, type, timeInForce: 'GTC' };
    if (type === 'TAKE_PROFIT_LIMIT')
      params.triggerPrice = takeProfit.toString();
    return this.signedRequest('api/v3/order', params, 'POST');
  }
}

const main = async () => {
  const client = new Client();
  const ticker = await client.ticker({})
  console.log(ticker);

  const bal = await client.account({})
  console.log(bal?.balances);

  // console.log(await client.cancelAllOrders({}));


  // console.log(await client.order({ quantity: 10, price: +ticker.price - 0.1 }));
  // console.log(await client.order({ quantity: 10, price: +ticker.price + 0.1, side: 'SELL' }));


  const openOrd = await client.openOrders({});
  console.table(openOrd.map(o => ({ side: o.side.substring(0, 3), price: o.price, qty: o.origQty, quote: o.origQuoteOrderQty, sym: o.symbol, type: o.type })));

  // console.log(await client.order({ quantity: 10, price: 14.95, side: 'SELL'}));
  // console.log(await client.order({ quantity: 10, price: 12.84, }));
};

// Only run if this file is being run directly
if (import.meta.url.startsWith('file:')) {
  main().catch(console.error);
}

export default Client;
