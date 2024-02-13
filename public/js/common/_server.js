// https://vuejs.org/guide/scaling-up/ssr.html
import express from 'express';
import { renderToString } from 'vue/server-renderer';
import { createApp } from './app.js';
import domino from 'domino';
const winObj = domino.createWindow();
global['window'] = winObj;
global['document'] = winObj.document;
global['location'] = winObj.location;

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
            "@vue/devtools-api": "//unpkg.com/@vue/devtools-api@6.4.5/lib/esm/index.js",
            "chart.js": "//cdn.jsdelivr.net/npm/chart.js@4.4.1/+esm",
            "vue-router": "//unpkg.com/vue-router@4/dist/vue-router.esm-browser.js",
            "vue": "//unpkg.com/vue@3/dist/vue.esm-browser.prod.js"
          }}
        </script>
        <script type="module" crossorigin src="js/common/_client.js"></script>
        <script defer crossorigin src="js/allglobal.js"></script>
        <link rel="stylesheet" crossorigin href="css/output.css">
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `);
  });
});

server.use(express.static('./public'));

server.listen(3000, () => {
  console.log('listening on 3000');
});
