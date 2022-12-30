import express from "express";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";

// Create Express Server
const app = express();

// Configuration
const PORT = 3333;
const HOST = "localhost";

// Logging the requests
app.use(morgan("dev"));

// Proxy Logic : Proxy endpoints
app.use(
	"/sapi",
	createProxyMiddleware({
		target: "https://api.binance.com",
		changeOrigin: true,
		// pathRewrite: {
		// 	"^/users": "",
		// },
	})
);

// Starting our Proxy server
app.listen(PORT, HOST, () => {
	console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
