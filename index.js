const express = require('express');
const app = express();

const genres = [
    {
        id: 1, 
        genre: 'horror'
    },
    {
        id: 2, 
        genre: 'romance'
    }
];

app.get('/', (req, res) => {
    res.send('Vidly.com is a great server. Use our API to get info.');
});

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.listen(3000, () => console.log('Listening on port 3000.'));