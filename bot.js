
import { RestClientV5 } from 'bybit-api';
import dotenv from 'dotenv';
dotenv.config();

const _restClient = new RestClientV5({ key: process.env.k, secret: process.env.s, parseAPIRateLimits: true, });

let markP = 0, orderP = 0, takeP = 0, eqv = 0;
let params = {};

process.stdin.setEncoding("utf8");
process.stdin.on("data", async (d) => {
  // console.log(`\n${d}`);
  try {
    switch (d[0]) {
      case `-`:
        await getTickers();
      break;
      case `=`:
          await setParams();
          const response = await _restClient.submitOrder(params);
          console.log(response);
        break;
      case `[`:
        const act = await _restClient.getActiveOrders({ category: 'linear', symbol: 'BTCUSDT', });
        console.log(act.result);
        break;
      case `]`:
        const pos = await _restClient.getPositionInfo({ category: 'linear', symbol: 'BTCUSDT', openOnly: 1, limit: 50, });
        console.log(pos.result);
        break;
      case `;`:
        break;
      case `'`:
        break;
      case `\\`:
        break;
      case `,`:
        const balcoin = await _restClient.getWalletBalance({ accountType: 'UNIFIED', });
        console.log(`\x1b[1m\x1b[43m`);
        console.log(balcoin.result.list?.[0].coin);
        console.log(`\x1b[0m\r\n`);
        break;
      case `.`:
        const bal = await _restClient.getWalletBalance({ accountType: 'UNIFIED', });
        console.log(bal.result);
        break;
      case `/`:
        const eqv = await _restClient.getWalletBalance({ accountType: 'UNIFIED', });
        const totalEquity = Math.round(+eqv.result.list?.[0].totalEquity);
        process.stdout.write(`\x1b[45m totalEquity: ${totalEquity} \x1b[m\r\n`);
        break;
      case `_`:
        console.log(eval(`${d}\n`));
        break;
      default:
        console.log(eval(`state.${d}\n`));
    }
  } catch (e) {
    err(e?.message);
  }
});




while(1) {
  const bal = await _restClient.getWalletBalance({ accountType: 'UNIFIED', });
  eqv = Math.round(+bal.result.list?.[0].totalEquity);
  
  await setParams();

  if (markP < 78000) {
    const response = await _restClient.submitOrder(params);
    if (response.retCode !== 0)
      console.warn("\x1b[1m\x1b[43m%s\x1b[0m", response);
  }

  await new Promise((resolve) => setTimeout(resolve, 360000));
}



async function getTickers() {
  const tic = await _restClient.getTickers({ category: 'linear', symbol: 'BTCUSDT', });
  markP = Math.round(+tic.result.list?.[0].indexPrice);
  orderP = markP - 100;
  takeP = markP + 200;
  process.stdout.write(`\x1b[44m markPrice: \x1b[46m ${markP} \x1b[42m ${orderP} \x1b[41m ${takeP} \x1b[45m totalEquity: ${eqv} \x1b[m\r\n`);
}


async function setParams() {
  await getTickers();
  params = {
    category: 'linear',
    symbol: 'BTCUSDT',
    isLeverage: 1,
    side: 'Buy',
    orderType: 'Limit',
    qty: process.env.a,
    price: orderP.toString(),
    takeProfit: takeP.toString(),
    tpslMode: 'Partial',
    tpLimitPrice: takeP.toString(),
    tpOrderType: 'Limit',
  };
}

