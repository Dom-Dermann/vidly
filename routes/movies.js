const express = require('express');
const router = express.Router();
const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

router.post('/', auth, asyncMiddleware(async (req, res) => {
    // Joi validate client input
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // find genre ID and return error if not found
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send('Invalid genre ID');

    // if it passed validation, the movie document is created
    const movie = new Movie({
        title: req.body.title, 
        // load the id and name form the genre ID the client provided
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save()
        .then( (m) => res.send(m))
        .catch( (err) => res.send(err));
}));

router.get('/', asyncMiddleware(async (req, res) => {
    await Movie.find()
        .then( (m) => res.send(m))
        .catch( (err) => res.send(err));
}));

router.get('/:id', async (req, res) => {
    await Movie.findById(req.params.id, function (err, m) {
        if (err) return res.status(400).send('Movie ID not found');
        res.send(m);
    });
});

router.put('/:id', auth, async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.send(result.error.details[0].message);

    await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title, 
        genreId: req.body.genreId, 
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate
    }, function (err, m) {
        if (err) return res.sendStatus(400);
        res.send(m);
    });
});

router.delete('/:id', auth, async (req, res) => {
    const result = validate(req.body);
    if (result.error) return res.send(result.error.details[0].message);

    await Movie.findByIdAndRemove(req.params.id, function (err, m) {
        if (err) return res.sendStatus(400);
        res.send(m);
    })
})

module.exports = router;