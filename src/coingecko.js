import axios from "axios";
import { log } from "./utils/logger.js";

const btcPrice = async (ticker) => {
  const url = "https://api.coingecko.com/api/v3/simple/price";
  
  let params = `?`;
  params += `ids=${ticker}`
  params += `&vs_currencies=usd`;
  
  const res = await axios.get(url + params);
  const json = res.data;

  // const response = await fetch(url);
  // const json = await response.json();
  return json;
}

export { btcPrice };
