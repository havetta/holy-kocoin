import express from "express";
import { readFileSync, writeFile, writeFileSync} from "fs";

const router = express.Router();
router.use(express.json());
export default router;



//? /////////////////////////////////////////////////////////
//?  COMMON /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
const startRequest = (req) => {
  console.log(100000000000000000000, `   `, new Date().toLocaleString(), `   `, 100000000000000000000);
  console.log(JSON.stringify(req.body, null, `\t`));
  return req.query?.microsite?.toLowerCase();
};

const getComponentList = (microsite) => {
  const rawData = readFileSync(`public/${microsite}/__componentList.js`, `utf8`);
  return JSON.parse(rawData.toString().split(`//||`)?.[1]);
};

const componentImports = (list) => {
  let out = ``;
  const imports = list.map(c => `import ${c?.acronym} from "./${c?.acronym}.js";`);
  const exports = list.map(c => `\n{ name: "${c?.acronym}", instance: ${c?.acronym} }`);
  out = imports.join(`\n`);
  out += `\n\nexport default [`
  out += exports.join(`, `);  
  out += `\n];`;
  return out;
};



//? /////////////////////////////////////////////////////////
//?   GETS  /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
router.get(`/`, (req, res) => {
  const list = getComponentList(microsite);
  res.json(list);
});

router.get(`/:id`, (req, res) => {
  const list = getComponentList(microsite);
  const results = list.filter(article => article.id == req.params.id);
  res.json(results);
});

//* /////////////////////////////////////////////////////////
//*   POST  /////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.post(`/`, (req, res) => {
  const microsite = startRequest(req);

  // read state from disk
  const list = getComponentList(microsite);
  list.unshift(req.body); // add passed in data as first array item

  // write data back to state file
  let out = `import { reactive } from "vue"; export default reactive(//||\n`;
  out += JSON.stringify(list, null, `\t`);
  out += `\n//||\n)`;
  writeFileSync(`public/${microsite}/__componentList.js`, out);
  
  // recreate components imports 
  writeFileSync(`public/${microsite}/__222.js`, componentImports(list));

  res.status(201).json({ status: `ok` })
});



//* /////////////////////////////////////////////////////////
//*   PUT   /////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.put(`/`, (req, res) => {
  const microsite = startRequest(req);

  let out = ``;
  out += req.body?.imports ?? ``;
  out += `\nexport default { \n  template: `;
  out += '`';
  out += `\n${req.body?.texthtml ?? ``}\n`;
  out += '  `,\n\n';
  out += `//! /////////////////////////////////////////////////////////`;
  out += `\n\n  setup(props, { attrs, emit, expose, slots }) {\n`;
  out += req.body?.textscript ?? ``;
  out += `\n  },\n}`;
  
  writeFileSync(`public/${microsite}/__${req.body?.acronym}.js`, out);
  res.status(201).json({ status: `ok` })
});



//! /////////////////////////////////////////////////////////
//!  DELETE /////////////////////////////////////////////////
//! /////////////////////////////////////////////////////////
router.delete(`/`, (req, res) => {
  const { id } = req.body;
  components.splice(id-1, id);
  res.json({success: true, message: `deleted`});
});
