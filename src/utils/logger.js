export function log(str) {
  console.table(str);
};

export function sameline(str) {
  process.stdout.write(`${str}\r`);
};

export function err(str) {
  console.error(str);
};
