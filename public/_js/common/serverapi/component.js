import { readFileSync, writeFile, writeFileSync } from 'fs';

import express from 'express';

const router = express.Router();
router.use(express.json());
export default router;

//? /////////////////////////////////////////////////////////
//?  COMMON /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
const startRequest = (req) => {
  console.log(
    100000000000000000000,
    `   `,
    new Date().toLocaleString(),
    `   `,
    100000000000000000000,
  );
  console.log(JSON.stringify(req.body, null, `\t`));
  return req.query?.micropage?.toLowerCase();
};

const readComponentList = (micropage) => {
  const rawData = readFileSync(`public/${micropage}/_componentList.js`, `utf8`);
  return JSON.parse(rawData.toString().split(`//||`)?.[1]);
};

const writeComponentList = (micropage, list) => {
  let out = `import { ref } from "vue"; export default ref(//||\n`;
  out += JSON.stringify(list, null, `\t`);
  out += `\n//||\n)`;
  writeFileSync(`public/${micropage}/!_componentList.js`, out);
};

const componentImports = (list) => {
  let out = ``;
  const imports = list.map(
    (c) => `import ${c?.shortname} from "./${c?.shortname}.js";`,
  );
  const exports = list.map(
    (c) => `\n{ name: "${c?.shortname}", instance: ${c?.shortname} }`,
  );
  out = imports.join(`\n`);
  out += `\n\nexport default [`;
  out += exports.join(`, `);
  out += `\n];`;
  return out;
};

//? /////////////////////////////////////////////////////////
//?   GETS  /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
router.get(`/`, (req, res) => {
  const list = readComponentList(micropage);
  res.json(list);
});

router.get(`/:id`, (req, res) => {
  const list = readComponentList(micropage);
  const results = list.filter((article) => article.id == req.params.id);
  res.json(results);
});

//* /////////////////////////////////////////////////////////
//*   POST  /////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.post(`/`, (req, res) => {
  const micropage = startRequest(req);

  // read state from disk
  const list = readComponentList(micropage);

  // add passed in data as first array item
  list.unshift(req.body);

  // write data back to state file
  writeComponentList(micropage, list);

  // recreate components imports file
  writeFileSync(
    `public/${micropage}/!_componentImports.js`,
    componentImports(list),
  );

  res.status(201).json({ status: `ok` });
});

//* /////////////////////////////////////////////////////////
//*   PUT   /////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.put(`/`, (req, res) => {
  const micropage = startRequest(req);

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

  writeFileSync(`public/${micropage}/!__${req.body?.shortname}.js`, out);
  res.status(201).json({ status: `ok` });
});

//! /////////////////////////////////////////////////////////
//!  DELETE /////////////////////////////////////////////////
//! /////////////////////////////////////////////////////////
router.delete(`/`, (req, res) => {
  const { id } = req.body;
  components.splice(id - 1, id);
  res.json({ success: true, message: `deleted` });
});
