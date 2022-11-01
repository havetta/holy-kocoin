import { state } from "./store.js";

export function isDownTrend() {
  let res = true;

  const p = state.recentPrices;
  const l = p.length;

  if (l < 5)
    return false;
  
  let p1, p2, p3, p4;

  p1 = p[0];
  p2 = p[1];
  p3 = p[2];
  p4 = p[3];
  const oldAvg = (p1 + p2 + p3 + p4) / 4;

  p1 = p[l-1];
  p2 = p[l-2];
  p3 = p[l-3];
  p4 = p[l-4];
  const newAvg = (p1 + p2 + p3 + p4) / 4;

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
