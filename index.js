const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

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

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find( (g) => g.id === parseInt(req.params.id));
    if (!genre){
        res.status(404).send('Genre not found.');
        return;
    }

    res.send(genre);
});

app.post('/api/genres', (req, res) => {
    const schema = {
        genre: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        res.status(400).send('Bad request: ' + result.error.details[0].message);
        return;
    }

    const genre = {
        id: genres.length + 1,
        genre: req.body.genre
    }
    genres.push(genre);

    res.send(req.body.genre);
});

app.listen(3000, () => console.log('Listening on port 3000.'));