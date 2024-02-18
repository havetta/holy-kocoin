import { readFileSync, writeFileSync} from "fs";

export function componentput(request, respond) {
  let body = '';
  filePath = __dirname + '/public/data.txt';
  request.on('data', function(data) {
      body += data;
  });

  request.on('end', function () {
    writeFileSync ("public/templates/", JSON.stringify(res.data))

      fs.appendFile(filePath, body, function() {
          respond.end();
      });
  });
}


// import express.js and user express.router two api post methods save json array of objects on disk remove specific entry by id from file on disk json data array of objects properties id name description

/*Certainly! Let’s break down your requirements step by step:

Express.js Router with Two API POST Methods:
To create an Express.js router with two API POST methods, you can define your routes using the Express Router. Here’s a basic example:
JavaScript

// Create an Express router
const express = require('express');
const router = express.Router();

// Define your API routes
router.post('/api/orgs', (req, res) => {
    // Handle the first POST method for saving JSON data
    // Assuming you have a MongoDB model called 'Organization'
    const newOrg = new Organization(req.body);
    newOrg.save((err) => {
        if (err) res.status(500).json({ error: 'Error saving organization' });
        else res.json(newOrg);
    });
});

router.post('/api/orgs/remove/:id', (req, res) => {
    // Handle the second POST method for removing an entry by ID
    const orgId = req.params.id;
    Organization.findByIdAndRemove(orgId, (err, removedOrg) => {
        if (err) res.status(500).json({ error: 'Error removing organization' });
        else res.json({ message: 'Organization removed successfully', removedOrg });
    });
});

module.exports = router;






const fs = require('fs');

const jsonArray = [
    { id: 1, name: 'Organization A', description: 'Description A' },
    { id: 2, name: 'Organization B', description: 'Description B' },
    // ... more objects
];

fs.writeFile('organizations.json', JSON.stringify(jsonArray), (err) => {
    if (err) console.error('Error saving JSON file:', err);
    else console.log('JSON array saved to disk.');
});
AI-generated code. Review and use carefully. More info on FAQ.
Remove Specific Entry by ID from File on Disk:
To remove a specific entry by ID from the JSON file on disk, you’ll need to read the file, modify the array, and then save it back. Here’s an example:
JavaScript

const fileIdToRemove = 2; // Example ID to remove

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
*/