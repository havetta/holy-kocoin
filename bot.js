
import { RestClientV5 } from 'bybit-api';
import dotenv from 'dotenv';
dotenv.config();



//? /////////////////////////////////////////////////////////
//? *****  STATE  *****
//? /////////////////////////////////////////////////////////
let minP = 0, markP = 0, orderP = 0, takeP = 0, eqv = 0;
let params = {}, position = {};
const _restClient = new RestClientV5({ key: process.env.k, secret: process.env.s, parseAPIRateLimits: true, });
process.stdout.write(`\x1b[1m\x1b[46mMinimal\x1b[44m Mark \x1b[42mBuyPrice\x1b[41mTakeProfit\x1b[43m Total Equity\x1b[40m Pos.Size \x1b[45m Position PnL\x1b[m\r\n`);



//! /////////////////////////////////////////////////////////
//! *****   MAIN LOOP  *****
//! /////////////////////////////////////////////////////////
dosetup();
setInterval(runloop, 60000); // 60000 milliseconds == 1 minute
while(1) {
  if (markP < minP  &&  position?.list?.lenght === 0) {
    await submitOrder();
  }
  await new Promise((resolve) => setTimeout(resolve, 30*60000)); // 30*60000 milliseconds == 30 minute
}



//* /////////////////////////////////////////////////////////
//* *****  FUNCTIONS  *****
//* /////////////////////////////////////////////////////////
async function dosetup() {
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async (d) => {
    // console.log(`\n${d}`);
    try {
      switch (d[0]) {
        case `-`:
          await getTickers();
          break;

        case `=`:
          await submitOrder();
          break;

        case `[`:
          const act = await _restClient.getActiveOrders({ category: 'linear', symbol: 'BTCUSDT', });
          console.log(act?.result);
          break;
        case `]`:
          const pos = await _restClient.getPositionInfo({ category: 'linear', symbol: 'BTCUSDT', openOnly: 1, limit: 50, });
          console.log(pos?.result);
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
          console.log(balcoin?.result?.list?.[0].coin);
          console.log(`\x1b[0m\r\n`);
          break;
        case `.`:
          const bal = await _restClient.getWalletBalance({ accountType: 'UNIFIED', });
          console.log(bal?.result);
          break;
        case `/`:
          const min = await _restClient.getMarkPriceKline({ interval: '1', category: 'linear', symbol: 'BTCUSDT', });
          console.table(min?.result?.list);
          break;
        case `_`:
          console.log(eval(`${d}\n`));
          break;
        default:
          console.log(eval(`state.${d}\n`));
      }
    } catch (e) {
      console.error(e?.message);
    }
  });
}



async function runloop() {
  const bal = await _restClient.getWalletBalance({ accountType: 'UNIFIED', });
  eqv = Math.round(+bal?.result?.list?.[0].totalEquity);

  const min = await _restClient.getMarkPriceKline({ interval: '5', category: 'linear', symbol: 'BTCUSDT', });
  minP = Math.round(min.result.list?.[0]?.[3]);
  min.result.list.forEach(i => {
    if (i[3] < minP)
      minP = Math.round(i[3]);
  });
  
  await getTickers();
}



async function getTickers() {
  position = (await _restClient.getPositionInfo({ category: 'linear', symbol: 'BTCUSDT', openOnly: 1, limit: 50, }))?.result;

  const tic = await _restClient.getTickers({ category: 'linear', symbol: 'BTCUSDT', });
  markP = Math.round(+tic?.result?.list?.[0].indexPrice);
  orderP = markP;
  takeP = markP + 100;
  const size = parseFloat(position?.list?.[0]?.size);
  const PnL = Math.round(position?.list?.[0]?.unrealisedPnl);
  process.stdout.write(`\x1b[1m\x1b[46m ${minP} \x1b[44m ${markP} \x1b[42m ${orderP} \x1b[41m ${takeP} \x1b[43m Equity: ${eqv} \x1b[40m Size: ${size} \x1b[45m PnL: ${PnL}\x1b[m\r\n`);
}



async function submitOrder() {
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
  const response = await _restClient.submitOrder(params);
  console.log(response);
}

