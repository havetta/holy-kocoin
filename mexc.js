import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import minimist from "minimist";
import dotenv from "dotenv";
dotenv.config();
const cliArgs = minimist(process.argv.slice(2));
const usr = cliArgs?._?.[0] ?? `a`;
let maxBuy = null, markP = 0, orderP = 0, takeP = 0;



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

  // console.log(await client.cancelAllOrders({}));
  // console.log(await client.order({ quantity: 1, price: 13.45, side: 'SELL'}));
  // console.log(await client.order({ quantity: 1, price: 12.11, }));
  // const ret = await client.futuresOrder({ vol: 2, price: avg.price, });

  const openOrd = await client.openOrders({});    console.table(openOrd.map(o => ({ side: o.side.substring(0, 3), price: o.price, qty: o.origQty, quote: o.origQuoteOrderQty, sym: o.symbol, type: o.type })));

  while(1) {
    let bal = await client.account({});
    let eqv = Math.round(bal?.balances?.find(b => b.asset === 'USDT')?.free); // and 'locked' is sum in orders
    let eqvlocked = Math.round(bal?.balances?.find(b => b.asset === 'USDT')?.locked);
    let apt = (+bal?.balances?.find(b => b.asset === 'APT')?.free).toFixed(2);
    let locked = (+bal?.balances?.find(b => b.asset === 'APT')?.locked).toFixed(2);

    const avg = await client.avgPrice({});
    markP = (+avg.price).toFixed(2);
    orderP = (+markP - 0.1).toFixed(2);
    takeP = (+markP + 0.1).toFixed(2);

    if(apt > 0) {
      await client.order({ quantity: 1, price: maxBuy ?? +markP+0.7, side: 'SELL' });
    }
    
    maxBuy = maxBuy > takeP ? maxBuy : takeP;

    if(eqv > 20) {
      await client.order({ quantity: 1, price: orderP });
    }

    const time = new Date().toISOString().slice(8, 10) + ' ' + new Date().toISOString().slice(11, 16);
    process.stdout.write(`${time}\x1b[1m\x1b[46m ${maxBuy} \x1b[40m ${markP} \x1b[41m ${orderP} \x1b[42m ${takeP} \x1b[43m Equity: ${eqv}+${eqvlocked} \x1b[45m apt: ${apt} \x1b[44m locked: ${locked}\x1b[m\r\n`);

    // Wait a minute
    await new Promise((resolve) => setTimeout(resolve, 1*60000)); // 60*60000 milliseconds == 1 hour

    bal = await client.account({});
    apt = Math.round(+bal?.balances?.find(b => b.asset === 'APT')?.free);
    if(apt > 0)
      await client.order({ quantity: 1, price: takeP, side: 'SELL' });

    await new Promise((resolve) => setTimeout(resolve, 10*60000)); // 60*60000 milliseconds == 1 hour
  }

};



// Only run if this file is being run directly
if (import.meta.url.startsWith('file:')) {
  main().catch(console.error);
}



export default MexcClient;
