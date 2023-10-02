// RUN using cmd:  "npm t"
import { mainRunSpot } from "./mainRunSpot.js";

(async () => {
  mainRunSpot();
})();

export const main = mainRunSpot;