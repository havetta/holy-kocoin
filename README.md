# holy-kocoin
 
 ## Run
 > in the terminal type `npm t`
 
 ## Configuration
> create a `.env` file with the following content:

``` js
exchange=binanceusdm
symbol=BTC/USDT
spread=YOUR PRICE FLUCTUATION DIFFERECE FOR BUY SIGNAL AND SELL PRICE
tradeSum=YOUR AMOUNT (IN BTC)) TO TRADE WITH
apikey=ADD YOUR API KEY
secret=ADD YOUR API SECRET
```
 ## Project files:

| File         | Description |
| ------------ | ----------- |
| main.js      | execute bot with command "node dist/main" |
| runner.js    | runs one whole update cycle every second |
| exchange.js  | cctx api to communicate with exchange |
| coingecko.js | get crypto prices from coingecko.com |
|  |   |


