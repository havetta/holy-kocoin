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

router.put("/", (req, res) => {
  const { id, acronym } = req.body;
  components[id-1].acronym = acronym;
  res.json({success: true, message: "updated"});
});

router.delete("/", (req, res) => {
  const { id } = req.body;
  components.splice(id-1, id);
  res.json({success: true, message: "deleted"});
});

export default router;
