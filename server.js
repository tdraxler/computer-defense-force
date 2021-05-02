const express = require('express');

// Try to use port number from the command line arguments
const PORT = process.argv[2] || 3000;

let app = express();

app.use(express.static('public'));

// Main route
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`);
});