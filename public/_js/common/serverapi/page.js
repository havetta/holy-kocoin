import { readFileSync, writeFileSync } from 'fs';

import express from 'express';

const router = express.Router();
router.use(express.json());
export default router;

//? /////////////////////////////////////////////////////////
//?  COMMON /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
const startRequest = (req) => {
  console.log(100000000000000000000, `   `, new Date().toLocaleString(), `   `, 100000000000000000000,);
  console.log(JSON.stringify(req.body?.shortname, null, `\t`));
  return readPageList();
};

const readPageList = () => {
  const rawData = readFileSync(`public/_pageList.js`, `utf8`);
  const text = rawData.toString().split(`//||`)?.[1];
  const list = [];
  text.split('\n').forEach((i) => {
    const row = i.split(',');
    const pageName = row[1].split(':')[1];
    list.push( pageName.replace('},', '') );
  });
  return list;
};

const writePageList = (list) => {
  const imports = list?.map((i) => `import ${i} from "./${i}/_sectionList.js";`);
  let out = ``;
  out = imports.join(`\n`);
  out += `import { ref } from 'vue';`;
  out += `export const pageList = ref([\n//||\n`;
  out += list.map((i) => { `{ shortpgname: '${i}', sectionList:${i}\n}` }).join('\n');
  out += `\n//||\n]);`;
  writeFileSync(`public/_pageList.js`, out);
};

const writePageImports = (list) => {
  const imports = list?.map((i) => `import ${i} from "./${i}/_sectionImports.js";`);
  const exports = list?.map((i) => `\n  { shortpgname: "${i}", sectionImports: ${i} }`);
  let out = ``;
  out = imports.join(`\n`);
  out += `\n\nexport const pageImports =`;
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
  res.json(results);
});

//* /////////////////////////////////////////////////////////
//*   PUT  //////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.put(`/`, (req, res) => {
  const list = startRequest(req);

  list.unshift(req.body); // add passed in data as first array item

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
