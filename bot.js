
import { RestClientV5 } from 'bybit-api';
import minimist from "minimist";
import dotenv from 'dotenv';
import e from 'express';
dotenv.config();
const cliArgs = minimist(process.argv.slice(2));
const usr = cliArgs?._?.[0] ?? `a`;
const spread = +process.env[`spread`];


//? /////////////////////////////////////////////////////////
//? *****  STATE  *****
//? /////////////////////////////////////////////////////////
let minP = 0, markP = 0, orderP = 0, takeP = 0, eqv = 0;
let params = {};
let position = { list: [{size: 0}]};
const _restClient = new RestClientV5({ key: process.env[`${usr}-k`], secret: process.env[`${usr}-s`], parseAPIRateLimits: true, });
process.stdout.write(`Datetime\x1b[1m\x1b[46mMinimal\x1b[40m Mark \x1b[42mBuyPrice\x1b[41mTakeProfit\x1b[43m Total Equity\x1b[45m Pos.Size \x1b[44m Position PnL\x1b[m User: ${usr}\r\n`);



//! /////////////////////////////////////////////////////////
//! *****   MAIN LOOP  *****
//! /////////////////////////////////////////////////////////
dosetup();
await runloop();
setInterval(runloop, 10*60000); // 60000 milliseconds == 1 minute
while(1) {
  await new Promise((resolve) => setTimeout(resolve, 16*60*60000)); // 60*60000 milliseconds == 1 hour

  const maxAmount = +process.env[`${usr}-a`] * 5; // maximum of 5 amount increments
  const largePosition = position?.result?.list?.filter(p => Math.abs(p.size) >= maxAmount);
  if (largePosition.length > 0) {
    console.log(`============= LARGE POSITION SIZE ${largePosition[0].size} =============`);
  }
  else
  {
    if (markP < minP + 2000) {
      await submitOrder({});
      console.log(`#######################################################################################`);
    }
    else
      console.log(`@@@@@@@@@@@@@@@@ CONDITIONS NOT MET markP ${markP} | minP ${minP} @@@@@@@@@@@@@@@@`);
  }
}



//* /////////////////////////////////////////////////////////
//* *****  FUNCTIONS  *****
//* /////////////////////////////////////////////////////////
async function runloop() {
  const bal = await _restClient.getWalletBalance({ accountType: 'UNIFIED', });
  eqv = Math.round(+bal?.result?.list?.[0].totalEquity);

  const min = await _restClient.getMarkPriceKline({ interval: '5', category: 'linear', symbol: 'BTCUSDT', });
  minP = Math.round(min.result.list?.[0]?.[3]);
  min.result.list.forEach(i => {
    if (i[3] < minP)
      minP = Math.round(i[3]);
  });

  position = await _restClient.getPositionInfo({ category: 'linear', symbol: 'BTCUSDT', openOnly: 1, limit: 50, });
  
  await getCurrentPrice();
}



async function getCurrentPrice() {
  const tic = await _restClient.getTickers({ category: 'linear', symbol: 'BTCUSDT', });
  markP = Math.round(+tic?.result?.list?.[0].markPrice);
  orderP = markP - spread / 4;
  takeP = markP + spread;
  const size = parseFloat(position?.result?.list?.[0].size);
  const PnL = Math.round(position?.result?.list?.[0].unrealisedPnl);
  const time = new Date().toISOString().slice(8, 10) + ' ' + new Date().toISOString().slice(11, 16);
  process.stdout.write(`${time}\x1b[1m\x1b[46m ${minP} \x1b[40m ${markP} \x1b[42m ${orderP} \x1b[41m ${takeP} \x1b[43m Equity: ${eqv} \x1b[45m Size: ${size} \x1b[44m PnL: ${PnL}\x1b[m\r\n`);
}



async function submitOrder({ symbol = 'BTCUSDT', side= 'Buy' }) {
  await getCurrentPrice();
  const takeProfit = (takeP-spread+5).toString() // Make sure limit order is not executed right away, and decrease tp by spread+5
  params = {
    category: 'linear',
    symbol,
    side,
    isLeverage: 1,
    orderType: 'Limit',
    qty: process.env[`${usr}-a`],
    price: (side === 'Sell' ? takeP : orderP).toString(),
  };
  if (side === 'Buy') {
    Object.assign(params, {
      takeProfit: takeProfit,
      tpslMode: 'Partial',
      tpLimitPrice: takeP.toString(),
      tpOrderType: 'Limit',
    });
  }
  const response = await _restClient.submitOrder(params);
  process.stdout.write(`\x1b[1m \x1b[43m${response?.retMsg}\x1b[m  =====>  tp:  ${takeProfit}  =====>  Buy:  \x1b[42m${orderP}\x1b[m  =====>  Sell:  \x1b[41m ${takeP} \x1b[m\r\n`);
}



async function dosetup() {
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async (d) => {
    // console.log(`\n${d}`);
    try {
      switch (d[0]) {
        case ` `:
          await runloop();
          break;

        case `=`:
        case `+`:
          await submitOrder({});
          break;

        case `-`:
        case `_`:
            await submitOrder({side: 'Sell'});
          break;
  
          case `[`:
          const act = await _restClient.getActiveOrders({ category: 'linear', symbol: 'BTCUSDT', });
          act?.result?.list?.forEach(e => {
            const buyAt = (e.tpLimitPrice > 0 ? `Buy:${e.price}` : e.stopOrderType);
            const sellAt = (e.tpLimitPrice > 0 ? `Sell:${e.tpLimitPrice}` : `At:${e.price}`);
            const tp = (e.tpLimitPrice > 0 ? e.takeProfit : e.triggerPrice)
            process.stdout.write(`\x1b[1m${e.symbol} \x1b[46m${e.qty}\x1b[40m On:${e.lastPriceOnCreated} \x1b[42m${buyAt}\x1b[41m ${sellAt} \x1b[43mtpCreateOn:${tp} \x1b[44m ${e.leavesValue}\x1b[m\r\n`);
          });
          // console.log(act?.result);
          break;
        case `]`:
          const pos = await _restClient.getPositionInfo({ category: 'linear', symbol: 'BTCUSDT', openOnly: 1, limit: 50, });
          console.log(pos?.result);
          break;
        case `\\`:
          const ret = await _restClient.cancelAllOrders({category: 'linear', symbol: 'BTCUSDT'});
          console.log(ret?.result);
          break;
        case `'`:
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
        default:
          console.log(eval(`${d}\n`));
      }
    } catch (e) {
      console.error(e?.message);
    }
  });
}



export default _restClient;
