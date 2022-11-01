export function twoDecimals(num) {
  const noDecimal = Math.trunc(num);
  let res = `${noDecimal}.`;

  const twoDecimal = Math.trunc(num*100) - noDecimal*100;

  res += (new String(twoDecimal) + "00").substring(0,2);
  return res;
};

export function leftPad(str, len) {
  let res = new String(str);
  res = res.padEnd(len," ");
  res = res.substring(0, len);
  return res;
}

export function rightPad(str, len) {
  let res = new String(str);
  res = res.padStart(len," ");
  res = res.substring(res.length - len - 1, len);
  return res;
}
