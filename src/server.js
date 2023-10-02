import Fastify from 'fastify'
import { state, getExchange } from "./store.js";

export const fastify = Fastify({ logger: false });
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
fastify.get('/buy', async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  
  let lower = state.curPrice < state.avgPrice ? state.curPrice : state.avgPrice;
  state.buyPrice = lower - state.spread;

  await getExchange().createOrder(state.symbol, "limit", "buy", state.tradeSums[0], state.buyPrice);
  
  return { status: 'buy', symbol: state.symbol, buyPrice: state.buyPrice }
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
fastify.get('/sell', async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");

  let higher = state.curPrice < state.avgPrice ? state.avgPrice : state.curPrice;
  let sellPrice = higher;
  await getExchange().createOrder(state.symbol, "limit", "sell", state.tradeSums[0], sellPrice);

  return { status: 'sell', symbol: state.symbol, sellPrice: sellPrice }
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
fastify.get('/balance', async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  
  const bal = await getExchange().fetchBalance();
  const pairBTC = state.symbol.split('/')[0];
  const pairUSD = state.symbol.split('/')[1];
  state.freeBtc = bal?.free[pairBTC];
  state.freeUsd = bal?.free[pairUSD];

  return {
    status: 'balance',
    _____________BTC_free__: state.freeBtc,
    _____________BTC_total__: bal?.total[pairBTC],
    _____________: '',
    _____________USD_free__: state.freeUsd,
    _____________USD_total__: bal?.total[pairUSD]
  }
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
fastify.get('/orders', async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  
  const orders = await getExchange().fetchOpenOrders(state.symbol);

  return orders
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
fastify.get('/cancel', async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  
  const orders = await getExchange().fetchOpenOrders(state.symbol);
  const filtered = orders.filter(i => i.symbol === state.symbol && i.side === "sell");
  for (let i in filtered) {
    let i = 0;
    const id = filtered[i].id;
    await getExchange().cancelOrder(id, state.symbol);
  }
  return orders
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
const start = async () => {
  try {
    await fastify.listen({ port: process.env.port })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};
start();
