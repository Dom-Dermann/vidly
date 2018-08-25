// import modules
const express = require('express');
const exDebugger = require('debug')('app:express');
const app = express();
const genres = require('./routes/genres');

// install middleware
app.use(express.json());
app.use('/api/genres', genres);

app.get('/', (req, res) => {
    res.send('Vidly.com is a great server. Use our API to get info.');
});

var port = process.env.port || 3000;
app.listen(3000, () => exDebugger(`Listening on port ${port}.`));