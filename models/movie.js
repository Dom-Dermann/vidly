const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('../models/genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String, 
        required: true, 
        trim: true,
        minlength: 3, 
        maxlength: 50
    },
    genre:{
        type: genreSchema, 
        required: true   
    },
    numberInStock: {
        type: Number,
        max: 1000,
        required: true
    },
    dailyRentalRate: {
        type: Number, 
        max: 100, 
        required: true
    }
}));

function validate(body) {
    
    const schema = {
        title: Joi.string().required().min(3).max(50),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required()
    };

    const result = Joi.validate(body, schema);

    return result;
}

module.exports.Movie = Movie;
module.exports.validate = validate;
