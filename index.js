const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Vidly.com is a great server. Use our API to get info.');
})

app.listen(3000, () => console.log('Listening on port 3000.'));