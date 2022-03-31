const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use('/dist', express.static(path.resolve(__dirname, 'dist')));
app.use(express.static(path.resolve(__dirname, 'example')));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});