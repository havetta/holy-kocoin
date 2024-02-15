// https://vuejs.org/guide/scaling-up/ssr.html
import express from 'express';
import bodyParser from "body-parser";
import domino from 'domino';
import { renderToString } from 'vue/server-renderer';
import { createApp } from './appshared.js';
import { componentput } from './serverapi/componentput.js';

const winObj = domino.createWindow();
global['window'] = winObj;
global['document'] = winObj.document;
global['location'] = winObj.location;

const server = express();

server.use(express.static('./public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.post('/post', (req, res) => {
  res.send({ status: 'ok', message: 'post works' });
});

server.post('/componentput', componentput );

server.get('/', (req, res) => {
  const app = createApp(req);

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <script type="importmap">
          { "imports": {
            "@vue/devtools-api": "/js/devtools-api",
            "chart.js": "js/chart.js",
            "vue-router": "/js/vue-router.esm-browser.js",
            "vue": "/js/vue.esm-browser.prod.js"
          }}
        </script>
        <script type="module" crossorigin src="js/common/appclient.js"></script>
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

server.listen(3000, () => {
  console.log('listening on 3000');
});
