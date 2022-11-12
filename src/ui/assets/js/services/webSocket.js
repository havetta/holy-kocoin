
//////////////////////////////////////////////////////////////////////////////
// Binance Web Socket
const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stateCcxt.tradeSymbol.toLowerCase().replace("/", "")}@trade`);
ws.onmessage = function (event) {
  try {
    const btc = JSON.parse(event.data);
    const p = new Number(btc.p);
    stateCcxt.currPrice = p;
  }
  catch(e) {
    console.error(e?.message);
  }
};

