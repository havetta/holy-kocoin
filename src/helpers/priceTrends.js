import { state } from "../store.js";

function fromTo(from, count) {
  const len = state.recentPrices.length;

  if (from < 0)
    from = len + from - 1; // from the end of recent prices

  let to = from + count - 1;
  if (from >= len)
    from = len - 1;
  if (to >= len)
    to = len - 1;

  return [from, to];
}

///////////////////////////////////////////////////////////
export function highestPrice(fromIn, count) {
  const [from, to] = fromTo(fromIn, count)
  let high = state.recentPrices[from];
  for (let i = from; i <= to; i++) {
    if (state.recentPrices[i] > high)
    high = state.recentPrices[i];
  }
  return high;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function lowestPrice(fromIn, count) {
  const [from, to] = fromTo(fromIn, count)
  let low = state.recentPrices[from];
  for (let i = from; i <= to; i++) {
    if (state.recentPrices[i] < low)
      low = state.recentPrices[i];
  }
  if (!low)
    low = Math.min(...state.recentPrices);

  return low;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function recentPriceAvg(fromIn, count) {
  const [from, to] = fromTo(fromIn, count)
  let avg = 0;
  for (let i = from; i <= to; i++) {
    avg += state.recentPrices[i];
  }
  avg = avg / count;
  return avg;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function isDownTrend() {
  const l = state.recentPrices.length;
  if (l < 5)
    return false;
  
  const oldAvg = recentPriceAvg(0, 5);
  const newAvg = recentPriceAvg(-5, 5);

  if (oldAvg > newAvg + 3)
    return true;

  return false;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function isUpTrend() {
  const l = state.recentPrices.length;
  if (l < 5)
    return false;
  
  const oldAvg = recentPriceAvg(0, 5);
  const newAvg = recentPriceAvg(-5, 5);

  if (oldAvg < newAvg - 3)
    return true;

  return false;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
