
import { DefaultLogger, RestClientV5, WebsocketClient } from 'bybit-api';
import axios from "axios";
import crypto from "crypto";
import dotenv from 'dotenv';
dotenv.config();

const restClient = new RestClientV5({ key: process.env.apikey, secret: process.env.secret, parseAPIRateLimits: true, });

const bal = await restClient.getWalletBalance({
  accountType: 'UNIFIED',
});
console.log(bal.result.list);
console.log(bal.result.list[0].coin);


// const params = {
//   api_key: secret,
//   symbol: 'BTCUSDT',
//   side: 'Buy',
//   order_type: 'Market',
//   qty: 0.0001,
//   time_in_force: 'GoodTillCancel',
//   leverage: 2,
//   take_profit: 1,
//   tp_trigger_by: 'ROE',
//   reduce_only: false,
//   close_on_trigger: false,
//   timestamp: Date.now()
// };

// const queryString = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');

// params.sign = crypto.createHmac('sha256', secret).update(queryString).digest('hex')

// const response = await axios.post('https://api.bybit.com/v2/private/order/create', null, { params });
// console.log(response.data);





// Optional, uncomment the "silly" override to log a lot more info about what the WS client is doing
const customLogger = {
  ...DefaultLogger,
  // silly: (...params) => console.log('trace', ...params),
};

const wsClient = new WebsocketClient(
  { key: process.env.apikey, secret: process.env.secret, market: 'v5', },
  customLogger,
);

function setWsClientEventListeners(websocketClient, accountRef) {
  return new Promise((resolve) => {
    websocketClient.on('update', (data) => {
      console.log(new Date(), accountRef, 'data ', JSON.stringify(data));
      // console.log('raw message received ', JSON.stringify(data, null, 2));
    });

    websocketClient.on('open', (data) => {
      console.log(
        new Date(),
        accountRef,
        'connection opened open:',
        data.wsKey,
      );
    });
    websocketClient.on('response', (data) => {
      console.log(
        new Date(),
        accountRef,
        'log response: ',
        JSON.stringify(data, null, 2),
      );

      if (typeof data.req_id === 'string') {
        const topics = data.req_id.split(',');
        if (topics.length) {
          console.log(new Date(), accountRef, 'Subscribed to topics: ', topics);
          return resolve();
        }
      }
    });
    websocketClient.on('reconnect', ({ wsKey }) => {
      console.log(
        new Date(),
        accountRef,
        'ws automatically reconnecting.... ',
        wsKey,
      );
    });
    websocketClient.on('reconnected', (data) => {
      console.log(new Date(), accountRef, 'ws has reconnected ', data?.wsKey);
    });
    websocketClient.on('error', (data) => {
      console.error(new Date(), accountRef, 'ws exception: ', data);
    });
  });
}

async function doloop() {
  try {
    const onSubscribed = setWsClientEventListeners(wsClient, 'demoAcc');

    wsClient.subscribeV5(['position', 'execution', 'wallet'], 'linear');

    // Simple promise to ensure we're subscribed before trying anything else
    await onSubscribed;

    // Start trading
    const balResponse1 = await restClient.getWalletBalance({
      accountType: 'UNIFIED',
    });
    console.log('balResponse1: ', JSON.stringify(balResponse1, null, 2));

    const demoFunds = await restClient.requestDemoTradingFunds();
    console.log('requested demo funds: ', demoFunds);

    const balResponse2 = await restClient.getWalletBalance({
      accountType: 'UNIFIED',
    });
    console.log('balResponse2: ', JSON.stringify(balResponse2, null, 2));

    /** Simple examples for private REST API calls with bybit's V5 REST APIs */
    const response = await restClient.getPositionInfo({
      category: 'linear',
      symbol: 'BTCUSDT',
    });

    console.log('response:', response);

    // Trade USDT linear perps
    const buyOrderResult = await restClient.submitOrder({
      category: 'linear',
      symbol: 'BTCUSDT',
      orderType: 'Market',
      qty: '1',
      side: 'Buy',
    });
    console.log('buyOrderResult:', buyOrderResult);

    const sellOrderResult = await restClient.submitOrder({
      category: 'linear',
      symbol: 'BTCUSDT',
      orderType: 'Market',
      qty: '1',
      side: 'Sell',
    });
    console.log('sellOrderResult:', sellOrderResult);

    const balResponse3 = await restClient.getWalletBalance({
      accountType: 'UNIFIED',
    });
    console.log('balResponse2: ', JSON.stringify(balResponse3, null, 2));
  } catch (e) {
    console.error('request failed: ', e);
  }
}

// while(1) {
//   await doloop();
//   await new Promise((resolve) => setTimeout(resolve, 5000));

// }
