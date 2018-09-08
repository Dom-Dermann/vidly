const mongoose = require('mongoose');
const Joi = require('joi');

// create a schema and model for the interaction
const genreSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minlength: 3, 
        maxlength: 30
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function checkSchema(body) {
    const schema = {
        name : Joi.string().min(3).required()
    };

    var result = Joi.validate(body, schema);
    return result;
}

module.exports.Genre = Genre;
module.exports.validate = checkSchema;
module.exports.genreSchema = genreSchema;