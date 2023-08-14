import ccxt from "ccxt";

///////////////////////////////////////////////////////////
const exchanges = async () => {
  let exList = "";
  ccxt.exchanges.forEach(function(exchangeName){
    exList += `${exchangeName} | `;
  });
  console.warn(exList);
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
const fetchMarkets = async () => {
  ccxt.exchanges.forEach(async exchangeName => {
    let exchange = new ccxt[exchangeName]();

    if (!"bigone buda bw mercado zaif".includes(exchangeName) && exchange.has["fetchMarkets"]) {
      const markets = await exchange.fetchMarkets();
      let res = markets
        .map(i => ({ symbol: i.symbol, taker: i.taker, maker: i.maker, future: i.future }))
        .filter(i => i["taker"] < 0.0006 && i.future)
        .slice(0, 10);
      
      if(res.length > 0)
      {
        console.log(exchangeName);
        console.log(res);
      }
    }
  });
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
const kukoinZeroFees = async () => {
  let exchange = new ccxt["kucoin"]();

  const markets = await exchange.fetchMarkets();
  let res = markets
      .map(i => ({ symbol: i.symbol, taker: i.taker, maker: i.maker, future: i.future }))
      .filter(i => i["taker"] === 0)
    
  if(res.length > 0)
    console.log(`Kucoin zero fee trading pairs:`)
    console.log(res);
}
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
export { exchanges, fetchMarkets, kukoinZeroFees };
