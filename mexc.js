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

      console.log("Request Parameters:", parameters);

      const url = `${endpoint.startsWith('http') ? '' : this.spotUrl}/${endpoint}`;
      const response = await axios({ method: method, url: `${url}`, headers: headers, params: parameters, });

      console.log(response.status);
      return response.data;
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

  async order_deal_fee({ params }) {
    return this.signedRequest("api/v1/private/account/asset_book/order_deal_fee/total", params, "GET");
  }

  async order({ symbol = 'APT_USDT', vol, price }) {
    const params = {
      symbol,
      price,
      quantity: vol,
      side: 'BUY',
      orderType: 'LIMIT',
      timeInForce: 'GTC'
    };
    return this.signedRequest('api/v3/order', params, 'POST');
  }
  
  async futuresOrder({ symbol = 'WBTCUSDT', vol, price }) {
    const params = {
      symbol,
      price,
      vol: vol.toString(),
      leverage: 2,
      side: 1,
      type: 6,
      openType: 1,
      takeProfitPrice: price + 100
    };
    return this.signedRequest(`${this.futuresUrl}/api/v1/private/order/submit`, params, "POST");
  }
}

const main = async () => {
  const client = new MexcClient();
  // const ret = await client.placeOrder({ vol: 0.0001, price: 97130.0, });
  const ret = await client.order({ vol: 6, price: `12.35`, });
  console.log(ret);
};

// Only run if this file is being run directly
if (import.meta.url.startsWith('file:')) {
  main().catch(console.error);
}

export default MexcClient;
