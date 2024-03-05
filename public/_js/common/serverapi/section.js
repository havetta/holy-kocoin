import { readFileSync, writeFile, writeFileSync } from 'fs';

import express from 'express';

const router = express.Router();
router.use(express.json());
export default router;

//? /////////////////////////////////////////////////////////
//?  COMMON /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
const startRequest = (req) => {
  console.log(100000000000000000000, `   `, new Date().toLocaleString(), `   `, 100000000000000000000,);
  console.log(JSON.stringify(req.body, null, `\t`));
  return req.query?.page?.toLowerCase();
};

const readSectionList = (page) => {
  const rawData = readFileSync(`public/${page}/_sectionList.js`, `utf8`);
  console.log(rawData.toString())

  return JSON.parse(rawData.toString().split(`//||`)?.[1]);
};

const writeSectionList = (page, list) => {
  let out = `export default\n//||\n`;
  out += JSON.stringify(list, null, `\t`);
  out += `\n`;
  writeFileSync(`public/${page}/_sectionList.js`, out);
};

const writeSectionImports = (page, list) => {
  const imports = list?.map((i) => `import ${i?.shortname} from "./${i?.shortname}.js";`);
  const exports = list?.map((i) => `\n{ name: "${i?.shortname}", instance: ${i?.shortname} }`);
  let out = ``;
  out = imports.join(`\n`);
  out += `\n\nexport default [`;
  out += exports.join(`, `);
  out += `\n];`;
  
  writeFileSync(`public/${page}/_sectionImports.js`, out);
};

const writeSectionContent = (page, list) => {
  let out = `
import { computed, h, reactive, ref, shallowRef, watch } from 'vue';
import { fetchJson } from '../_js/_functions.js';
import { globalStore, globalVars } from '../_globalVars.js';`;
  out += imports ?? ``;
  out += `\nexport default {\n  template: `;
  out += '`';
  out += `\n${req.body?.texthtml ?? ``}\n`;
  out += '  `,\n\n';
  out += `//! /////////////////////////////////////////////////////////`;
  out += `\n\n  setup(props, { attrs, emit, expose, slots }) {\n`;
  out += `\n    return {\n      ...globalStore,\n      globalVars,\n`;
  out += req.body?.textscript ?? ``;
  out += `\n\n    };\n  },\n  mounted() {\n    if (this.mounted) this.mounted();\n  },\n}\n`;

  writeFileSync(`public/${page}/${req.body?.shortname}.js`, out);
};

//? /////////////////////////////////////////////////////////
//?   GETS  /////////////////////////////////////////////////
//? /////////////////////////////////////////////////////////
router.get(`/`, (req, res) => {
  res.json(readSectionList(page));
});

router.get(`/:id`, (req, res) => {
  const list = readSectionList(page);
  const results = list.filter((i) => i.id === req.params.id);
  res.json(results);
});

//* /////////////////////////////////////////////////////////
//*   PUT  //////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.put(`/`, (req, res) => {
  const page = startRequest(req);

  const list = readSectionList(page);
  list.unshift(req.body); // add passed in data as first array item
  writeSectionImports(page, list);
  writeSectionList(page, list);

  res.status(201).json({ status: `ok` });
});

//* /////////////////////////////////////////////////////////
//*   POST   ////////////////////////////////////////////////
//* /////////////////////////////////////////////////////////
router.post(`/`, (req, res) => {
  const page = startRequest(req);

  const list = readSectionList(page);
  const index = list?.findIndex((i) => i?.id);
  sections.splice(index - 1, index);
  list.push(req.body)
  writeSectionImports(page, list);
  writeSectionList(page, list);
  writeSectionContent(page, list);

  res.status(201).json({ status: `ok` });
});

//! /////////////////////////////////////////////////////////
//!  DELETE /////////////////////////////////////////////////
//! /////////////////////////////////////////////////////////
router.delete(`/`, (req, res) => {
  const index = list?.findIndex((i) => i?.id);
  sections.splice(index - 1, index);
  res.status(201).json({ status: `ok` });
});
