// RUN using cmd:  "npm t"
import { mainRun } from "./runner.js";

import dotenv from "dotenv";

dotenv.config();

(async () => {
  mainRun();
})();
