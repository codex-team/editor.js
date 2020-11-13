const express = require('express');
const app = express();
const path = require('path');

const PORT = 8080;

app.get('/editor.js', function (req, res) {
  res.sendFile(path.join(__dirname, '../../../dist/editor.js'));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'test.html'));
});

app.listen(PORT);

console.log(`Test Server : http://localhost:${PORT}`);
