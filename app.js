const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const CodesFilePath = path.join(__dirname, 'Codes.json');
let Codes = [];

// Load Codes from Codes.json if the file exists
if (fs.existsSync(CodesFilePath)) {
  const CodesData = fs.readFileSync(CodesFilePath, 'utf8');
  Codes = JSON.parse(CodesData);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/getCodes', (req, res) => {
  res.json(Codes);
});

app.post('/addCode', (req, res) => {
  const { author, message, verification } = req.body;

  // Check if verification matches the secret word
  if (verification !== 'freefire') {
    return res.status(403).send('Verification failed. Access denied.');
  }

  const newCode = { id: uuidv4(), author, message };
  Codes.push(newCode);

  // Save updated Codes to Codes.json
  fs.writeFileSync(CodesFilePath, JSON.stringify(Codes, null, 2));

  res.status(201).json(newCode);
});

// New route to handle unique message URLs
app.get('/message/:id', (req, res) => {
  const messageId = req.params.id;
  const Code = Codes.find(Code => Code.id === messageId);
  if (!Code) {
    return res.status(404).send('Message not found');
  }
  res.type('text/plain'); // Set the content type to plain text
  res.send(Code.message);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
