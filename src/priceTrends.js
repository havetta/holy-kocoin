import { state } from "./store.js";

export function recentPriceAvg(from, count) {
  const len = state.recentPrices.length;

  if (from < 0)
    from = len + from - 1; // from the end of recent prices

  let to = from + count - 1;
  if (from >= len)
    from = len - 1;
  if (to >= len)
    to = len - 1;

  let avg = 0;
  for (let i = from; i <= to; i++) {
    avg += state.recentPrices[i];
  }
  
  avg = avg / count;
  return avg;
}

export function isDownTrend() {
  let res = true;

  const p = state.recentPrices;
  const l = p.length;

  if (l < 5)
    return false;
  
  const oldAvg = recentPriceAvg(0, 5);
  const newAvg = recentPriceAvg(-5, 5);

  if (oldAvg <= newAvg+1)
    res = false;
    
  // let str = "";
  // let lastAvg = p[0] + 20;
  // for (let i = 1; i < l-1; i++) {
  //   const p1 = p[i-1];
  //   const p2 = p[i];
  //   const p3 = p[i+1];
  //   const p4 = p[i < l-2 ? i+2 : i+1];
    
  //   const avg = (p1 + p2 + p3 + p4) / 4;
  //   str += `${avg} , `;

  //   if (lastAvg-1 < avg) {
  //     res = false;
  //     continue;
  //   }
    
  //   lastAvg = avg;
  // }

  // if (res)
  //   console.error(`\n\x1b[1m\x1b[31m${str}\x1b[0m\n`);
  return res;
}
