
import { RestClientV5} from 'bybit-api';

// Replace with your actual Bybit API credentials (NEVER store them in code)
const apiKey = 'T8Y20aZjKlROBO5rMf';
const apiSecret = 'BqlEjS8WowuzViXsDYDD1ytTKrRHyp8m5cAS';

// Create a Bybit client instance (testnet for demonstration purposes)
const client = new RestClientV5({
  apiKey,
  apiSecret,
});

async function placeOrderWithTakeProfit() {
  try {
    const markPriceKlineResult = await client.getMarkPriceKline({
      category: 'linear',
      interval: '15',
      symbol: 'BTCUSDT',
    });
    console.log('markPriceKlineResult: ', markPriceKlineResult);
    
/*    // Get current market price (optional, for reference)
    const symbolInfo = await client.inverse.kline.getKlineInfo({ symbol: 'BTCUSDT' });
    const currentPrice = symbolInfo.result.close[0];
    console.log(`Current BTCUSDT price: ${currentPrice}`);

    // Calculate Take Profit price (adjust the percentage as needed)
    const takeProfitPrice = currentPrice * (1 + 0.001); // 0.1% profit

    // Place the order with leverage and Take Profit
    const order = await client.inverse.order.create({
      symbol: 'BTCUSDT',
      side: Bybit.OrderSide.Buy,
      order_type: Bybit.OrderType.Limit,
      qty: 1, // Adjust quantity as needed
      price: currentPrice, // Market order price (consider slippage)
      leverage: 2, // 2x leverage
      close_on_trigger: true, // Close position on Take Profit
      stop_px: takeProfitPrice, // Take Profit price
    });

    console.log(`Order placed successfully! Order ID: ${order.result.order_id}`);
    */
  } catch (error) {
    console.error('Error placing order:', error);
  }
}

placeOrderWithTakeProfit();