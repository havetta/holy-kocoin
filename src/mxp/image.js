import nodeHtmlToImage from 'node-html-to-image'

nodeHtmlToImage({
  output: './dist/image.jpeg',
  type: 'jpeg',
  html: `<html><body><img src="https://sklab.bts.global.corp.sap/src/mxp/assets/product.jpg" /></body></html>`
}).then(() => console.log('The image was created successfully!'))

//html: `<html><body><img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/P%C3%A1ll-Gergely%2C_Hunyadi%2C_Jochum_%26_Asami_2015_Figs.12_Angustopila_dominikae.png" /></body></html>`
