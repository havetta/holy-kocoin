import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import minimist from "minimist";
import dotenv from "dotenv";
dotenv.config();
const cliArgs = minimist(process.argv.slice(2));
const usr = cliArgs?._?.[0] ?? `a`;

class MexcClient {
  constructor() {
    this.apiKey = process.env[`${usr}-mexck`];
    this.apiSecret = process.env[`${usr}-mexcs`];
    this.spotUrl = "https://api.mexc.com";
    this.futuresUrl = "https://futures.mexc.com";
  }

  async signedRequest(endpoint, params = {}, method = "GET") {
    try {
      const headers = { "X-MEXC-APIKEY": this.apiKey, "Content-Type": "application/json", };
      const parameters = { ...params, timestamp: Date.now(),  };
      const queryStr = querystring.stringify(parameters);
      const signature = crypto.createHmac("sha256", this.apiSecret).update(queryStr).digest("hex");
      parameters.signature = signature;

      const url = `${endpoint.startsWith('http') ? endpoint : this.spotUrl}/${endpoint}`;
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

  async order_deal_fee({}) {
    return this.signedRequest("api/v1/private/account/asset_book/order_deal_fee/total", params, "GET");
  }

  async account(params) {
    return this.signedRequest('api/v3/account', params, 'GET');
  }

  async avgPrice({ symbol = 'APTUSDT' }) {
    return this.signedRequest('api/v3/avgPrice', { symbol }, 'GET');
  }

  async openOrders({ symbol = 'APTUSDT' }) {
    return this.signedRequest('api/v3/openOrders', { symbol }, 'GET');
  }

  async cancelAllOrders({ symbol = 'APTUSDT' }) {
    return this.signedRequest('api/v3/openOrders', { symbol }, 'DELETE');
  }

  async order({ symbol = 'APTUSDT', side = 'BUY', type = 'LIMIT_MAKER', quantity, price, takeProfit }) {
    const params = { symbol, price, quantity, side, type, timeInForce: 'GTC' };
    if (type === 'TAKE_PROFIT_LIMIT')
      params.triggerPrice = takeProfit.toString();
    return this.signedRequest('api/v3/order', params, 'POST');
  }

  async futuresOrder({ symbol = 'APTUSDT', vol, price }) {
    const params = { symbol, price, vol: vol.toString(), leverage: 2, side: 1, type: 6, openType: 1, takeProfitPrice: price + 100 };
    return this.signedRequest(`${this.futuresUrl}/api/v1/private/order/submit`, params, "POST");
  }
}

const main = async () => {
  const client = new MexcClient();
  const bal = await client.account({})
  console.log(bal?.balances);

  // console.log(await client.cancelAllOrders({}));

  const avg = await client.avgPrice({})
  console.log(`avgPrice = ${+avg.price}`);

  // console.log(await client.order({ quantity: 10, price: +avg.price - 0.1 }));
  // console.log(await client.order({ quantity: 10, price: +avg.price + 0.1, side: 'SELL' }));


  const openOrd = await client.openOrders({});
  console.table(openOrd.map(o => ({ side: o.side.substring(0, 3), price: o.price, qty: o.origQty, quote: o.origQuoteOrderQty, sym: o.symbol, type: o.type })));

  // console.log(await client.order({ quantity: 10, price: 14.95, side: 'SELL'}));
  // console.log(await client.order({ quantity: 10, price: 12.84, }));

  // const ret = await client.futuresOrder({ vol: 2, price: avg.price, });
};

// Only run if this file is being run directly
if (import.meta.url.startsWith('file:')) {
  main().catch(console.error);
}

export default MexcClient;
