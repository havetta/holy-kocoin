// RUN using cmd:  "npm t"
import { runner } from "./src/runner.js";
(async () => {
  runner();
})();
export const main = runner;