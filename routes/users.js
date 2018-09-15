const express = require('express');
const router = express.Router();
const {User, validateUser, validatePasswordComplexity} = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash'); // for object / array / string manipulation etc.


router.post('/', async( req, res) => {
    // validate user input
    const result = validateUser(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);

    // validate password
    const pass = validatePasswordComplexity(req.body.password);
    if (pass.error) return res.status(400).send(pass.error.details[0].message);

    // make sure the user is not already registered by finding the unique email
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('A user with that email has already been registered.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    // begin encryption by generating the salt and creating the hashed password
    const salt = await bcrypt.genSalt(15);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save()
        .then( (u) => {
            // automatically sign in user once they signed up for the service - user gets their JSON web token
            const token = user.generateAuthToken();
            res.header('x-auth-token', token).send(_.pick(u, ['_id', 'name', 'email']));
        })
        .catch ( (err) => {return res.status(500).send(err)});
});

router.get('/', async (req, res) => {
    await User.find()
        .then( (u) => res.send(u))
        .catch( (err) => res.send(err));
});

router.put('/:id', async (req, res) => {
    const result = validateUser(body);
    if (result.error) return res.status(404).send(result.error.details[0].message);

    const user = await User.findById(req.params.id)
        .catch( (err) => {return res.send(err)});
    
    user = {
        _id: req.params.id,
        name: req.body.name, 
        email: req.body.email,
        password: req.body.password
    }

    await user.save()
        .then( (u) => res.send(u))
        .catch ( (err) => {return res.status(500).send(err)});
});

router.delete('/:id', async(req, res) => {
    User.findByIdAndRemove(req.params.id, (err, u) => {
        if (err) res.status(400).send(err);
        res.send(u);
    });
})

module.exports = router;