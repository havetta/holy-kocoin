// https://vuejs.org/guide/scaling-up/ssr.html
import express from 'express';
import { renderToString } from 'vue/server-renderer';
import { createApp } from './app.js';

const server = express();
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.get('/', (req, res) => {
  const app = createApp(req);

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="importmap">
          { "imports": {
            "vue": "//unpkg.com/vue@3/dist/vue.esm-browser.prod.js"
          }}
        </script>
        <script type="module" src="common/_client.js"></script>
        <script src="js/all.js"></script>
        <link href="css/output.css" rel="stylesheet">
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `);
  });
});

server.use(express.static('./src'));

server.listen(3000, () => {
  console.log('listening on 3000');
});