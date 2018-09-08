const {Rental, validateRentalJoi} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

Fawn.init(mongoose);

router.post('/', async (req, res) => {
    // test input with Joi
    const result = validateRentalJoi(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // see if customer exists
    const customer = await Customer.findById(req.body.customer_id)
        .catch( (err) => {return res.status(400).send('The customer ID you provided was not found.')});
    

    // see if movie exists
    let movie = await Movie.findById(req.body.movie_id)
        .catch( (err) => {return res.status(400).send('The movie ID you provided was not found.')});

    // see if the movie is still in stock
    if (movie.numberInStock === 0) return res.status(400).send('This movie is not in stock.');

    let rental = new Rental ({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title, 
            dailyRentalRate: movie.dailyRentalRate
        },
    });

    // transaction style simultaneous saving of two operations - if one fails, both fail
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: { numberInStock: -1}
            })
            .run();

        res.send(rental); 
        } catch (e) {
            console.log(e);
            res.status(500).send('A saving operation to the database failed.');
        }
        
})

router.get('/', async (req, res) => {
    // query all rentals
    await Rental.find()
        .sort('-dateOut')
        .then( (r) => {res.send(r)})
        .catch( (err) => {res.send(err)});
})

module.exports = router;