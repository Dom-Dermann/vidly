const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {User, validateUser, validatePasswordComplexity} = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash'); // for object / array / string manipulation etc.


router.post('/', async( req, res) => {
    // validate user input
    const result = validate(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // make sure the user is not already registered by finding the unique email
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});


function validate(body) {
    const schema = {
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().min(5).max(30).required()
    };
    return Joi.validate(body, schema);
}

module.exports = router;