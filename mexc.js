import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import minimist from "minimist";
import dotenv from "dotenv";
dotenv.config();
const cliArgs = minimist(process.argv.slice(2));
const usr = cliArgs?._?.[0] ?? `a`;

class MexcClient {
  constructor(apiKey, apiSecret) {
    this.apiKey = process.env[`${usr}-mexck`];
    this.apiSecret = process.env[`${usr}-mexcs`];
    this.baseUrl = "https://api.mexc.com";
  }

  async signedRequest(endpoint, params = {}, method = "GET") {
    try {
      // Add timestamp to parameters
      const parameters = {
        ...params,
        timestamp: Date.now(),
      };

      // Create query string
      const queryStr = querystring.stringify(parameters);

      // Create signature
      const signature = crypto.createHmac("sha256", this.apiSecret).update(queryStr).digest("hex");

      // Add signature to parameters
      parameters.signature = signature;

      // Prepare headers
      const headers = {
        "X-MEXC-APIKEY": this.apiKey,
        "Content-Type": "application/json",
      };

      // Prepare request config
      const config = {
        method: method,
        url: `${this.baseUrl}${endpoint}`,
        headers: headers,
        params: parameters,
      };

      // Log request details for debugging
      console.log("Request URL:", config.url);
      console.log("Request Headers:", headers);
      console.log("Request Parameters:", parameters);

      // Make the request
      const response = await axios(config);

      // Log response
      console.log("Response Status Code:", response.status);
      console.log("Response Content:", response.data);

      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("Error Code:", error.response.data.code || "N/A");
        console.log("Error Message:", error.response.data.msg || "N/A");
        console.log("Response:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.log("Request error:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error:", error.message);
      }
      return null;
    }
  }

  async placeOrder({ symbol = "WBTCUSDT", side = "BUY", orderType = "LIMIT", quantity, price, timeInForce = "GTC" }) {
    const endpoint = "/api/v3/order";

    // Prepare order parameters
    const params = {
      symbol,
      side,
      type: orderType,
      quantity: quantity.toString(),
    };

    // Add price for LIMIT orders
    if (orderType === "LIMIT") {
      params.price = price.toString();
      params.timeInForce = timeInForce;
    }

    return this.signedRequest(endpoint, params, "POST");
  }
}

const main = async () => {
  const API_KEY = "your_api_key";
  const API_SECRET = "your_api_secret";

  const client = new MexcClient(API_KEY, API_SECRET);

  // Example: Place a limit buy order
  const order = await client.placeOrder({
    symbol: "WBTCUSDT",
    side: "BUY",
    orderType: "LIMIT",
    quantity: 0.01,
    price: 30000,
    timeInForce: "GTC",
  });

  if (order) {
    console.log("\nOrder placed successfully:");
    console.log("Order ID:", order.orderId);
    console.log("Symbol:", order.symbol);
    console.log("Price:", order.price);
    console.log("Quantity:", order.origQty);
    console.log("Status:", order.status);
    console.log("Type:", order.type);
    console.log("Side:", order.side);
  }
};

// Only run if this file is being run directly
if (import.meta.url.startsWith('file:')) {
  main().catch(console.error);
}

export default MexcClient;
