const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = mongoose.model('Rental', new mongoose.Schema({
    customer: { 
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 3, 
                maxlength: 50,
            },
            isGold: {
                type: Boolean, 
            },
            phone: {
                type: String, 
                minlength: 7, 
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                minlength: 3, 
                maxlength: 50,
            },
            dailyRentalRate: {
                type: Number, 
                max: 100, 
                min: 0
            }
        }),
        required: true
    },
    dateOut: {
        type: Date, 
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number, 
        min: 0,
    }
}));

function validateRentalJoi (body) {
    const schema = {
        customer_id: Joi.objectId().required(), 
        movie_id: Joi.objectId().required()
    };



    return Joi.validate(body, schema);
}

module.exports.Rental = Rental;
module.exports.validateRentalJoi = validateRentalJoi;