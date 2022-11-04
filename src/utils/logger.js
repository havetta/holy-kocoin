export function sameline(msg) {
  process.stdout.write(`\x1b[44m${msg}\x1b[m\r`);
};

export function table(msg) {
  console.table(msg);
};

export function log(msg) {
  console.log("\x1b[46m%s\x1b[0m", msg);
};

export function underscore(msg) {
  console.log("\x1b[4m%s\x1b[0m", msg);
};

export function warn(msg) {
  console.warn("\x1b[1m\x1b[43m%s\x1b[0m", msg);
};

export function err(msg) {
  console.error("\x1b[1m\x1b[41m%s\x1b[0m", msg);
};

export function oneLine(first, msg1, msg2, msg3) {
  let msg = first;
  msg += ` \x1b[1m\x1b[44m`;
  if (msg1)
    msg += ` Avg price: \x1b[46m${msg1}\x1b[44m ....`;
  if (msg2)
    msg += ` Price now: \x1b[45m${msg2}\x1b[44m ....`;
  if (msg3)
    msg += ` ${msg3}`;
  process.stdout.write(`${msg}\x1b[m\r`);
}

