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
