///////////////////////////////////////////////////////////
export function twoDecimals(num) {
  const noDecimal = Math.trunc(num);
  return `${noDecimal}.${(new String(Math.trunc(num*100) - noDecimal*100) + "00").substring(0,2)}`;
};
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function leftPad(str, len) {
  let res = new String(str);
  res = res.padEnd(len," ");
  res = res.substring(0, len);
  return res;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export function rightPad(str, len) {
  let res = new String(str);
  res = res.padStart(len," ");
  res = res.substring(res.length - len);
  return res;
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
