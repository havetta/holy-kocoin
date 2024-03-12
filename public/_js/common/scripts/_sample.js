/*import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

import sections from "../../../__mxp/_sectionImports.js"

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<home/><button @click="count++">{{ count }}</button>`
  })

  sections.forEach(c => app.component(c.name, c.section) );

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html><html><body>
        <div id="app">${html}</div>
    </body></html>
    `)
  })
})

server.use(express.static('./src'));
server.listen(3000, () => {
  console.log('listening on 3000')
})*/
