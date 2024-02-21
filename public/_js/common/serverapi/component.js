import express from 'express';
import { readFileSync, writeFile, writeFileSync} from "fs";

const router = express.Router();
router.use(express.json());

const components = [{id: 1, acronym: "root", texthtml: new Date().toISOString()}];

router.get("/", (req, res) => {
  res.json(components);
});

router.get("/:id", (req, res) => {
  const results = components.filter(article => article.id == req.params.id);
  res.json(results);
});

router.post("/", (req, res) => {
  const microsite = req.query?.microsite?.toLowerCase();
  console.log(100000000000000000000, `   `, new Date().toLocaleString(), `   `, 100000000000000000000)
  console.log(JSON.stringify(req.body, null, "\t"));

  // read state from disk
  const dataFromStorage = readFileSync(`public/${microsite}/__componentList.js`, `utf8`);
  
  const fsjson = dataFromStorage.toString().split(`//||`);
  const list = JSON.parse(fsjson[1]);
  list.unshift(req.body);
  console.log(list);

  let out = 'import { ref } from "vue"; export default ref(//||\n';
  out += JSON.stringify(list, null, "\t");
  out += '\n//||\n)';

  writeFileSync(`public/${microsite}/__componentList.js`, out);
  
  
  const imports = list.map(c => `import ${c?.acronym} from "./${c?.acronym}.js"`);
  const exports = list.map(c => `\n{ name: "${c?.acronym}", instance: ${c?.acronym} }`);
  out = imports.join('\n');
  out += `\nexport default [\n`
  out += exports.join(', ');  
  out += `]`;
  writeFileSync(`public/${microsite}/__222.js`, out);
  // recreate file __generated.js from state
  // create file of component on disk

  
  res.status(201).json({ status: 'ok' })
});

router.put("/", (req, res) => {
  const microsite = req.query?.microsite?.toLowerCase();
  console.log(100000000000000000000, `   `, new Date().toLocaleString(), `   `, 100000000000000000000)
  console.log(JSON.stringify(req.body));

  let out = '';
  out += req.body?.imports ?? '';
  out += `\nexport default { \n  template: `;
  out += '`';
  out += `\n${req.body?.texthtml ?? ''}\n`;
  out += '  `,';
  out += `\n\n\n\n  setup(props, { attrs, emit, expose, slots }) {\n`;
  out += req.body?.textscript ?? '';
  out += `\n  },\n}`;
  
  writeFileSync(`public/${microsite}/__${req.body?.acronym}.js`, out);
  res.status(201).json({ status: 'ok' })
});

router.delete("/", (req, res) => {
  const { id } = req.body;
  components.splice(id-1, id);
  res.json({success: true, message: "deleted"});
});

export default router;
