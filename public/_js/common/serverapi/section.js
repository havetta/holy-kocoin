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
  return req.query?.page?.toLowerCase();
};

const readSectionList = (page) => {
  const rawData = readFileSync(`public/${page}/_sectionList.js`, `utf8`);
  return JSON.parse(rawData.toString().split(`//||`)?.[1]);
};

const writeSectionList = (page, list) => {
  let out = `import { ref } from "vue"; export default ref(//||\n`;
  out += JSON.stringify(list, null, `\t`);
  out += `\n//||\n)`;
  writeFileSync(`public/${page}/!_sectionList.js`, out);
};

const sectionImports = (list) => {
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
  const list = readSectionList(page);
  res.json(list);
});

router.get(`/:id`, (req, res) => {
  const list = readSectionList(page);
  const results = list.filter((article) => article.id == req.params.id);
  res.json(results);
});

//* /////////////////////////////////////////////////////////
//*   POST  /////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.post(`/`, (req, res) => {
  const page = startRequest(req);

  // read state from disk
  const list = readSectionList(page);

  // add passed in data as first array item
  list.unshift(req.body);

  // write data back to state file
  writeSectionList(page, list);

  // recreate sections imports file
  writeFileSync(
    `public/${page}/!_sectionImports.js`,
    sectionImports(list),
  );

  res.status(201).json({ status: `ok` });
});

//* /////////////////////////////////////////////////////////
//*   PUT   /////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.put(`/`, (req, res) => {
  const page = startRequest(req);

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

  writeFileSync(`public/${page}/!__${req.body?.shortname}.js`, out);
  res.status(201).json({ status: `ok` });
});

//! /////////////////////////////////////////////////////////
//!  DELETE /////////////////////////////////////////////////
//! /////////////////////////////////////////////////////////
router.delete(`/`, (req, res) => {
  const { id } = req.body;
  sections.splice(id - 1, id);
  res.json({ success: true, message: `deleted` });
});
