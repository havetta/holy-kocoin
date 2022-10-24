// RUN using cmd:  "npm t"
import { mainRun } from "./mainRun.js";

import dotenv from "dotenv";

dotenv.config();

(async () => {
  mainRun();
})();
