import nodeHtmlToImage from 'node-html-to-image'

nodeHtmlToImage({
  output: './src/data/image.jpeg',
  type: 'jpeg',
  html: `<html><head><meta name="viewport" content="width=1024px, initial-scale=1.0" /></head><body><iframe src="http://localhost:5500/src/mxp/" width=1024 height=768 /></body></html>`
}).then(() => console.log('The image was created successfully!'))

// html: `<html><body><img src="https://upload.wikimedia.org/wikipedia/commons/b/b3/P%C3%A1ll-Gergely%2C_Hunyadi%2C_Jochum_%26_Asami_2015_Figs.12_Angustopila_dominikae.png" /></body></html>`
// html: `<html><body><img src="https://sklab.bts.global.corp.sap/src/mxp/assets/nightroad.jpg" height=600 /></body></html>`