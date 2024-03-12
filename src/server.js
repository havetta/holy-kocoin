import ExpressJS from 'express'
// import expressCORS from '@express/cors'
import { conf, state, getExchange } from './store.js'

export const express = ExpressJS({ logger: false });

express.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

///////////////////////////////////////////////////////////
// buy
///////////////////////////////////////////////////////////
express.get('/buy', async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  try {
    state.buyPrice = state.curPrice - state.spread;
    await getExchange().createOrder(state.symbol, "limit", "buy", state.smallestAmount, state.buyPrice);
    return { status: 'buy', symbol: state.symbol, buyPrice: state.buyPrice, curPrice: state.curPrice, }
  }
  catch(e) {
    return { error: e?.message }
  }
});

///////////////////////////////////////////////////////////
// sell
///////////////////////////////////////////////////////////
express.get('/sell', async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  try {
    let higher = state.curPrice < state.avgPrice ? state.avgPrice : state.curPrice;
    let sellPrice = higher;
    await getExchange().createOrder(state.symbol, "limit", "sell", state.smallestAmount, sellPrice);
    return { status: 'sell', symbol: state.symbol, sellPrice: sellPrice, curPrice: state.curPrice, }
  }
  catch(e) {
    return { error: e?.message }
  }
});

///////////////////////////////////////////////////////////
// price
///////////////////////////////////////////////////////////
express.get('/price', async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  return {
    curPrice: state.curPrice,
    avgPrice: state.avgPrice,
    lastPrice: state.lastPrice,
    recentPrices: state.recentPrices,
    buyPrice: state.buyPrice,
    buyOrderCreated: state.buyOrderCreated,
    recentBuyPrices: state.recentBuyPrices,
    buyOrders: state.buyOrders,
  }
});

///////////////////////////////////////////////////////////
// balance
///////////////////////////////////////////////////////////
express.get('/balance', async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");

  const bal = await getExchange().fetchBalance();
  const pairBTC = state.symbol.split('/')[0];
  const pairUSD = state.symbol.split('/')[1];
  return {
    curPrice: state.curPrice,
    BTC_free: bal?.free[pairBTC],
    BTC_total: bal?.total[pairBTC],
    USD_free: bal?.free[pairUSD],
    USD_total: bal?.total[pairUSD],
    TOTAL_price: bal?.total[pairUSD] + bal?.total[pairBTC] * state.curPrice,
  }
});

///////////////////////////////////////////////////////////
// orders
///////////////////////////////////////////////////////////
express.get('/orders', async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  const side = req.query?.side?.toUpperCase();
  let orders = [];
  if (req.query?.closed !== '1') {
    orders = await getExchange().fetchOpenOrders(state.symbol);
  } else {
    orders = await getExchange().fetchClosedOrders(state.symbol);
  }
  orders = orders.filter(i => i.symbol === state.symbol && i.side.toUpperCase() === side)
  return { curPrice: state.curPrice, dataArray: orders };
});

///////////////////////////////////////////////////////////
// cancel sell
///////////////////////////////////////////////////////////
express.get('/cancel', async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  const side = req.query?.side?.toUpperCase();
  
  let orders = [];
  orders = await getExchange().fetchOpenOrders(state.symbol);
  orders = orders.filter(i => i.symbol === state.symbol && i.side.toUpperCase() === side);
  for (let index in orders) {
    let i = orders[index];
    await getExchange().cancelOrder(i.id, state.symbol);
    console.log({ datetime: i.datetime, side: i.side, price: i.price, amount: i.amount, usd: i.price*i.amount, status: i.status })
  }
  return { curPrice: state.curPrice, dataArray: orders };
});

///////////////////////////////////////////////////////////
// listen 
///////////////////////////////////////////////////////////
const start = async () => {
  try {
    const myPort = conf?.port?.[conf.usr] ?? 6000 + new Date().getMilliseconds();
    await express.listen({ port: myPort });
    console.log(`Listening on port ${myPort}`);
  } catch (err) {
    express.log.error(err);
    console.error(err);
    process.exit(1);
  }
};
start();
