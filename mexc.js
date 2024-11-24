import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import minimist from "minimist";
import dotenv from "dotenv";
dotenv.config();
const cliArgs = minimist(process.argv.slice(2));
const usr = cliArgs?._?.[0] ?? `a`;

class MexcClient {
  constructor() {
    this.apiKey = process.env[`${usr}-mexck`];
    this.apiSecret = process.env[`${usr}-mexcs`];
    this.baseUrl = "https://contract.mexc.com/";
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

  async placeOrder({ symbol = "BTCUSDC", vol, price }) {
    const endpoint = "api/v1/private/order/submit";

    // Prepare order parameters
    const params = {
      symbol,
      price,
      vol: vol.toString(),
      leverage: 2,
      side: 1,
      type: 6,
      openType: 1,
      takeProfitPrice: price + 100
    };

    return this.signedRequest(endpoint, params, "POST");
  }
}

const main = async () => {
  const client = new MexcClient();

  // Example: Place a limit buy order
  const order = await client.placeOrder({
    vol: 0.0001,
    price: 97222.0,
  });
  console.log(order);
};

// Only run if this file is being run directly
if (import.meta.url.startsWith('file:')) {
  main().catch(console.error);
}

export default MexcClient;
