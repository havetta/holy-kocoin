# holy-kocoin
 
 ## Run this BTC trading bot
 > in the terminal type `node index.js --usr=xy`
 
 ## Configuration
> create a `.env` file with the following content:

``` js
exchangeName=binanceusdm (FOR SPOT USE binance)
symbol=BTC
spread=YOUR PRICE (IN TUSD) FLUCTUATION DIFFERECE FOR BUY SIGNAL AND STOP LOSS SELL PRICE
amount=AMOUNT TO TRADE PER ONE ORDER
usr-apikey=ADD YOUR API KEY
usr-secret=ADD YOUR API SECRET
```
 ## Project files:

| File         | Description |
| ------------ | ----------- |
| main.js      | execute bot with command "node dist/main" |
| runner.js    | runs one whole update cycle every second |
| exchange.js  | cctx api to communicate with exchange |
| coingecko.js | get crypto prices from coingecko.com |
|  |   |


