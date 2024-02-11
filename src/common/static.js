import express from 'express'
const server = express()
server.use(express.static('./dist'));
server.listen(3000, () => {
  console.log('listening on 3000')
})