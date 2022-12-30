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
fastify.get('/orders', async (request, reply) => {
  reply.header("Access-Control-Allow-Origin", "*");
  
  const orders = await getExchange().fetchOpenOrders(state.symbol);

  return { status: 'orders', orders }
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
  return { status: 'cancel', orders }
});
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
const start = async () => {
  try {
    await fastify.listen({ port: 3333 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};
start();
