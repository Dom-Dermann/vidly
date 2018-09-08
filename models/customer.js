const mongoose = require('mongoose');
const Joi = require('joi');

// create mongoose schema and model
const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold : {
        type: Boolean,
        required: true,
    },
    name: {
        type: String, 
        required: true, 
        minlength: 3
    },
    phone: {
        type: String, 
        required: false, 
    }
}));

function joiValidator(body){
    const schema = {
        name: Joi.string().required().min(3),
        isGold: Joi.boolean().required(),
        phone: Joi.string()
    }

    return Joi.validate(body, schema);
}

module.exports.Customer = Customer;
module.exports.validate = joiValidator;