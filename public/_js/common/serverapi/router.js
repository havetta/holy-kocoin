import express from 'express';
import { readFileSync, writeFileSync} from 'fs';

const router = express.Router();

router.post('/component/put', (req, res) => {
  const newOrg = new Organization(req.body);
  newOrg.save((err) => {
    if (err) res.status(500).json({ error: 'Error saving organization' });
    else res.json(newOrg);
  });
});

router.post('component/remove/:id', (req, res) => {
  const orgId = req.params.id;
  
  fs.readFile('organizations.json', 'utf8', (err, data) => {
    if (err) console.error('Error reading JSON file:', err);
    else {
      const parsedArray = JSON.parse(data);
      const updatedArray = parsedArray.filter((org) => org.id !== fileIdToRemove);

      fs.writeFile('organizations.json', JSON.stringify(updatedArray), (writeErr) => {
        if (writeErr) console.error('Error saving updated JSON file:', writeErr);
        else console.log(`Entry with ID ${fileIdToRemove} removed.`);
      });
    }
  });

  Organization.findByIdAndRemove(orgId, (err, removedOrg) => {
    if (err) res.status(500).json({ error: 'Error removing organization' });
    else res.json({ message: 'Organization removed successfully', removedOrg });
  });
});

module.exports = router;