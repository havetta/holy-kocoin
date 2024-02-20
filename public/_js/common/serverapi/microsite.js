import express from 'express';
import { readFileSync, writeFileSync} from "fs";

const router = express.Router();
router.use(express.json());

const microsite = [
  { id: 1, acronym: "__mxp", description: 23 },
  { id: 2, acronym: "microtest", description: 26 },
  { id: 3, acronym: "powerpoint", description: 24 }];

router.get("/", (req, res) => {
  res.json(microsite);
});
router.get("/:id", (req, res) => {
  res.json(microsite.filter(user => user.id == req.params.id));
});
router.post("/", (req, res) => {
  const {id, acronym, description} = req.body;
  microsite.push({id, acronym, description});
  writeFileSync ("public/templates/", JSON.stringify(res.data))
  res.json({success: true, message: "added"});
});
router.put("/", (req, res) => {
  const { id, acronym } = req.body;
  microsite[id-1].acronym = acronym;
  res.json({success: true, message: "updated"});
});
router.delete("/", (req, res) => {
  const { id } = req.body;
  microsite.splice(id-1, id);
  res.json({success: true, message: "deleted"});
});

export default router;
