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

const readComponentList = (microsite) => {
  const rawData = readFileSync(`public/${microsite}/_componentList.js`, `utf8`);
  return JSON.parse(rawData.toString().split(`//||`)?.[1]);
};

const writeComponentList = (microsite, list) => {
  let out = `import { reactive } from "vue"; export default reactive(//||\n`;
  out += JSON.stringify(list, null, `\t`);
  out += `\n//||\n)`;
  writeFileSync(`public/${microsite}/_componentList.js`, out);
};

const componentImports = (list) => {
  let out = ``;
  const imports = list.map(c => `import ${c?.shortname} from "./${c?.shortname}.js";`);
  const exports = list.map(c => `\n{ name: "${c?.shortname}", instance: ${c?.shortname} }`);
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
  const list = readComponentList(microsite);
  res.json(list);
});

router.get(`/:id`, (req, res) => {
  const list = readComponentList(microsite);
  const results = list.filter(article => article.id == req.params.id);
  res.json(results);
});

//* /////////////////////////////////////////////////////////
//*   POST  /////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.post(`/`, (req, res) => {
  const microsite = startRequest(req);

  // read state from disk
  const list = readComponentList(microsite);

  // add passed in data as first array item
  list.unshift(req.body);

  // write data back to state file
  writeComponentList(microsite, list);
  
  // recreate components imports file
  writeFileSync(`public/${microsite}/_componentImports.js`, componentImports(list));

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
  
  writeFileSync(`public/${microsite}/__${req.body?.shortname}.js`, out);
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
