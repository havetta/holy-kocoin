import { readFileSync, writeFileSync } from 'fs';

import express from 'express';
import nodeHtmlToImage from 'node-html-to-image'

const router = express.Router();
router.use(express.json());
export default router;

//? /////////////////////////////////////////////////////////
//?  COMMON /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
const startRequest = (req) => {
  console.log(100000000000000000000, `   `, new Date().toLocaleString(), `   `, 100000000000000000000,);
  console.log(JSON.stringify(req.body?.id, null, `\t`));
  return readPageList();
};

const readPageList = () => {
  const rawData = readFileSync(`public/_pageList.js`, `utf8`);
  const text = rawData.toString().split(`//||`)?.[1];
  const list = [];
  text?.split('},\n').forEach((i) => {
    const pageName = i?.split('sectionList:')?.[1];
    if (pageName)
      list.push( pageName.trim().replace('},', '') );
  });
  return list;
};

const writePageList = (list) => {
  let out = ``;
  out = list?.map((i) => `import ${i} from './${i}/_sectionList.js';`).join(`\n`);
  out += `\n\nimport { ref } from 'vue';`;
  out += `\n\nexport const pageList = ref([\n//||\n`;
  out += list?.map((i) => `  { shortpgname: '${i}', sectionList: ${i} },`).join('\n');
  out += `\n//||\n]);`;
  writeFileSync(`public/_pageList.js`, out);
};

const writePageImports = (list) => {
  const imports = list?.map((i) => `import ${i} from './${i}/_sectionImports.js';`);
  const exports = list?.map((i) => `\n  { shortpgname: '${i}', sectionImports: ${i} }`);
  let out = ``;
  out = imports.join(`\n`);
  out += `\n\nexport const pageImports = [`;
  out += exports.join(`, `);
  out += `\n];`;
  
  writeFileSync(`public/_pageImports.js`, out);
};

//? /////////////////////////////////////////////////////////
//?   GETS  /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
router.get(`/`, (req, res) => {
  const list = startRequest(req);
  res.json(list);
});

router.get(`/:id`, (req, res) => {
  const list = startRequest(req);
  const results = list.filter((i) => i.id === req.params.id);

nodeHtmlToImage({
  output: './public/_mockdata/image.jpeg',
  type: 'jpeg',
  html: `<html><head><meta name="viewport" content="width=1024px, initial-scale=1.0" /></head><body><iframe src="http://localhost/?demo" width=1024 height=768 /></body></html>`
}).then(() => console.log('The image was created successfully!'))

  res.json(results);
});

//* /////////////////////////////////////////////////////////
//*   PUT  //////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.put(`/`, (req, res) => {
  const list = startRequest(req);

  list.unshift(req.body?.id); // add passed in data as first array item

  writePageImports(list);
  writePageList(list);

  res.status(201).json({ status: `ok` });
});

//* /////////////////////////////////////////////////////////
//*   POST   ////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.post(`/`, (req, res) => {
  const list = startRequest(req);

  const index = list?.findIndex((i) => i?.id === req.body?.id);
  list.splice(index, 1, req.body);

  writePageImports(list);
  writePageList(list);

  res.status(201).json({ status: `ok` });
});

//! /////////////////////////////////////////////////////////
//!  DELETE /////////////////////////////////////////////////
//! /////////////////////////////////////////////////////////
router.delete(`/`, (req, res) => {
  const list = startRequest(req);

  const index = list?.findIndex((i) => i?.id === req.body?.id);
  list.splice(index, 1);

  writePageImports(list);
  writePageList(list);
  
  res.status(201).json({ status: `ok` });
});
