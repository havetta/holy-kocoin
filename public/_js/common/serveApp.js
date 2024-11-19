// https://vuejs.org/guide/scaling-up/ssr.html
import { readFileSync } from 'fs';
import https from 'https';

import express from 'express';
import { renderToString } from 'vue/server-renderer';

import { createApp } from './appshared.js';
import { globalWindowMock } from './serveAppMocks.js';
import section from './serverapi/section.js';
import page from './serverapi/page.js';

globalWindowMock();

const server = express();

server.use('/page', page);
server.use('/section', section);

server.use(express.static('./public'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'localhost'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

server.get('/', async (req, res) => {
  console.log(100000000000000000000, `   CREATEAPP   `, 100000000000000000000,);
  const app = await createApp(req);

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>MXP addon</title>
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
        <script crossorigin="anonymous" src="_npm/jquery-2.2.4.min.js"></script>
        <script crossorigin="anonymous" src="_npm/jszip.min.js"></script>
        <script crossorigin="anonymous" src="_npm/pptxgen.min.js"></script>
        <script crossorigin src="_js/__allgenerated.js"></script>

        <script type="application/javascript">
          const pptx = new PptxGenJS();
        </script>

        <script>
          var require = { paths: { vs: '_npm/monaco-editor' } };
        </script>
        <script src="_npm/monaco-editor/loader.js"></script>
        <script src="_npm/monaco-editor/editor/editor.main.nls.js"></script>
        <script src="_npm/monaco-editor/editor/editor.main.js"></script>

        <link rel="stylesheet" href="_npm/monaco-editor/editor/editor.main.css" data-name="vs/editor/editor.main" />

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
  cert: readFileSync('./cert.pem', 'utf8'),
};
const httpsServer = https.createServer(options, server).listen(443, () => {
  console.log(`listening on port 443`);
});
const httpServer = server.listen(80, () => {
  console.log(`listening on port 80`);
});

// server.listen(80, () => { console.log(`listening on ${80}`); });
