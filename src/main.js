// RUN using cmd:  "npm t"
import { mainRunSpot } from "./mainRunSpot.js";

import dotenv from "dotenv";

dotenv.config();

(async () => {
  mainRunSpot();
})();
