import express from 'express';
const router = express.Router();
router.use(express.json());

const microsite = [{
    id: 1,
    name: "__mxp",
    age: 23
},
{
    id: 2,
    name: "microtest",
    age: 26
},
{
    id: 3,
    name: "powerpoint",
    age: 24
}];

router.get("/", (req, res) => {
    res.json(microsite);
});
router.get("/:id", (req, res) => {
    const results = microsite.filter(user => user.id == req.params.id);
    res.json(results);
});
router.post("/", (req, res) => {
    const {id, name, age} = req.body;
    microsite.push({id, name, age});
    res.json({success: true, message: "added"});
});
router.put("/", (req, res) => {
    const { id, new_name } = req.body;
    microsite[id-1].name = new_name;
    res.json({success: true, message: "updated"});
});
router.delete("/", (req, res) => {
    const { id } = req.body;
    microsite.splice(id-1, id);
    res.json({success: true, message: "deleted"});
    
});

export default router;
