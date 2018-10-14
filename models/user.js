const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});

// add a method to the user object
userSchema.methods.generateAuthToken = function(){
    return token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser (body) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().min(5).max(30).required()
    };
    return Joi.validate(body, schema);
}

function validatePasswordComplexity(password) {
    const complexityOptions = {
        min: 6,
        max: 30,
        lowerCase: 1, 
        upperCase: 1, 
        numeric: 1
    }

    return Joi.validate(password, new PasswordComplexity(complexityOptions));
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validatePasswordComplexity = validatePasswordComplexity;