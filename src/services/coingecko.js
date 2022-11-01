import axios from "axios";

export async function btcPrice(ticker) {
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
