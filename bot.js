
import { RestClientV5 } from 'bybit-api';
import dotenv from 'dotenv';
dotenv.config();

const restClient = new RestClientV5({ key: process.env.k, secret: process.env.s, parseAPIRateLimits: true, });


while(1) {
  const bal = await restClient.getWalletBalance({ accountType: 'UNIFIED', });
  const eqv = Math.round(+bal.result.list[0].totalEquity);

  const pos = await restClient.getPositionInfo({ category: 'linear', symbol: 'BTCUSDT', });
  let markP = Math.round(+pos.result.list[0].markPrice);
  let orderP = markP - 10;
  let takeP = markP + 100;
  process.stdout.write(`\x1b[47m markPrice: \x1b[46m ${markP} \x1b[42m ${orderP} \x1b[41m ${takeP} \x1b[45m totalEquity: ${eqv} \x1b[m\r\n`);

  if (markP < 92300) {

    const response = await restClient.submitOrder({
      category: 'linear',
      symbol: 'BTCUSDT',
      isLeverage: 1,
      side: 'Buy',
      orderType: 'Limit',
      qty: '0.01',
      price: orderP.toString(),
      takeProfit: takeP.toString(),
      tpslMode: 'Partial',
      tpLimitPrice: takeP.toString(),
      tpOrderType: 'Limit',
    });
    if (response.retCode !== 0)
      console.warn("\x1b[1m\x1b[43m%s\x1b[0m", response);
  }

  await new Promise((resolve) => setTimeout(resolve, 10000));
}
