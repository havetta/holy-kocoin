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
  return JSON.parse(rawData.toString().split(`//||`)?.[1]);
};

const writePageList = (list) => {
  let out = `export default\n//||\n`;
  out += JSON.stringify(list, null, `\t`);
  out += `\n`;
  writeFileSync(`public/_pageList.js`, out);
};

const writePageImports = (list) => {
  const imports = list?.map((i) => `import ${i?.shortname} from "./${i?.shortname}.js";`);
  const exports = list?.map((i) => `\n  { name: "${i?.shortname}", instance: ${i?.shortname} }`);
  let out = ``;
  out = imports.join(`\n`);
  out += `\n\nexport default [`;
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
