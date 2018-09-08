// import modules
const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const dbDebugger = require('debug')('app:db');

router.get('/', async (req, res) => {
    res.send(await Customer.find());
});

router.get('/:id', async (req, res) => {
    await Customer.findById(req.params.id, function(err, c) {
        if (err) res.send(err.message).sendStatus('404');
        res.send(c);
    });
})

router.post('/', async (req, res) => {
    const result = validate(req.body);

    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const customer = new Customer({
        isGold: req.body.isGold, 
        name: req.body.name, 
        phone: req.body.phone
    });

    await customer.save()
        .then( (c) => {res.send(c)})
        .catch( (err) => {res.send(err)});
})

router.put('/:id', async (req, res) => {
    const result = validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name, 
        isGold: req.body.isGold, 
        phone: req.body.phone}, function (err, c) {
            if (err) res.send(err)
            res.send(c)
    });
})

router.delete('/:id', async(req, res) => {
    await Customer.findByIdAndRemove(req.params.id)
        .then( (c) => res.send(c))
        .catch( (err) => res.send(err));
})

module.exports = router;