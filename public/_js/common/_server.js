/*// Storage Mock
function storageMock() {
  let storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}*/

global['window'] = {};
global['document'] = {};
global['location'] = {};
global['sessionStorage'] = { getItem: (item) => item, setItem: (item, value) => value };

// mock the sessionStorage and localStorage
window.localStorage = { getItem: (item) => item, setItem: (item, value) => value };;
window.sessionStorage = { getItem: (item) => item, setItem: (item, value) => value };;
window.history = { state: '' };
window.addEventListener = (event, handler) => {};
window.navigator = {};
window.navigator.maxTouchPoints = 0;
window.navigator.userAgent = 'ssr';
window.location = {};
window.location.search = '';
window.location.hash = '';
window.location.replace = (url) => url;
location.host = '';
document = {};

// https://vuejs.org/guide/scaling-up/ssr.html
import express from 'express';
import https from 'https';
import { renderToString } from 'vue/server-renderer';
import { readFileSync } from "fs";

import { createApp } from './appshared.js';
import microsite from "./serverapi/microsite.js";
import component from "./serverapi/component.js";

//import domino from 'domino';
/*const winObj = domino.createWindow();
global['window'] = winObj;
global['document'] = winObj.document;
global['location'] = winObj.location;*/

const server = express();

server.use("/microsite", microsite);
server.use("/component", component);

server.use(express.static('./public'));
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.post('/post', (req, res) => {
  res.send({ status: 'ok', message: 'post works' });
});

server.get('/', async (req, res) => {
  const app = await createApp(req);

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <script type="importmap">
          { "imports": {
            "@vue/devtools-api": "./_npm/devtools-api/index.js",
            "chart.js": "./_npm/chart.js",
            "vue-router": "./_npm/vue-router.esm-browser.js",
            "vue": "./_npm/vue.esm-browser.prod.js"
          }}
        </script>
        <script type="module" crossorigin src="_js/common/appclient.js"></script>
        <script defer crossorigin src="_js/__allgenerated.js"></script>
        <link rel="stylesheet" crossorigin href="_css/__allgenerated.css">
        <link rel="stylesheet" crossorigin href="_css/output.css">
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `);
  });
});

const options = {
  key: readFileSync('./certkey.pem', 'utf8'),
  cert: readFileSync('./cert.pem', 'utf8')
};
const httpsServer = https.createServer(options, server).listen(443, () => {
// const httpsServer = server.listen(80, () => {
  console.log(`listening on port`);
});

// server.listen(80, () => { console.log(`listening on ${80}`); });
