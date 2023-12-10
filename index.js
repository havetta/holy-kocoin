// RUN using cmd:  "npm t"
import { mainRunSpot } from "./src/mainRunSpot.js";
(async () => {
  mainRunSpot();
})();
export const main = mainRunSpot;