import express from 'express';
import { readFileSync, writeFileSync} from "fs";

const router = express.Router();
router.use(express.json());

const components = [{
  id: 1,
  acronym: "root",
  texthtml: new Date().toISOString()
},
{
  id: 2,
  acronym: "list",
  texthtml: new Date().toISOString()
},
{
  id: 3,
  acronym: "detail",
  texthtml: new Date().toISOString()
}];

router.get("/", (req, res) => {
  res.json(components);
});
router.get("/:id", (req, res) => {
  const results = components.filter(article => article.id == req.params.id);
  res.json(results);
});
router.post("/", (req, res) => {
  const {id, acronym, texthtml} = req.body;
  components.push({id, acronym, texthtml});
  writeFileSync(`public/${state.microsite}`, JSON.stringify(res.data));
  res.json({success: true, message: "added"});
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
