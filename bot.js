
import { RestClientV5 } from 'bybit-api';
import dotenv from 'dotenv';
dotenv.config();

const restClient = new RestClientV5({ key: process.env.k, secret: process.env.s, parseAPIRateLimits: true, });


while(1) {
  const bal = await restClient.getWalletBalance({ accountType: 'UNIFIED', });
  const totalEquity = bal.result.list[0].totalEquity

  const pos = await restClient.getPositionInfo({ category: 'linear', symbol: 'BTCUSDT', });
  let markPrice = Math.round(+pos.result.list[0].markPrice);
  let orderPrice = markPrice - 100;
  let tpPrice = markPrice + 100;
  process.stdout.write(`price buy sell \x1b[46m ${markPrice} \x1b[42m ${orderPrice} \x1b[41m ${tpPrice} \x1b[45m totalEquity ${totalEquity} \x1b[m\r\n`);

  if (markPrice < 92300) {

    const response = await restClient.submitOrder({
      category: 'linear',
      symbol: 'BTCUSDT',
      isLeverage: 1,
      side: 'Buy',
      orderType: 'Limit',
      qty: '0.01',
      price: orderPrice.toString(),
      takeProfit: tpPrice.toString(),
      tpslMode: 'Partial',
      tpLimitPrice: tpPrice.toString(),
      tpOrderType: 'Limit',
    });
    if (response.retCode !== 0)
      console.warn("\x1b[1m\x1b[43m%s\x1b[0m", response);
  }

  await new Promise((resolve) => setTimeout(resolve, 10000));
}
