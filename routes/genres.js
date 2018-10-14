// import modules
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const dbDebugger = require ('debug')('app:db');
const asyncMiddleware = require('../middleware/async');

router.get('/', asyncMiddleware (async (req, res) => {
    const genre = await Genre
        .find()
        .sort('genre');

    res.send(genre);
}));

router.get('/:id', (req, res) => {
    getSpecificGenre(req.params.id)
        .then( (g) => {
            res.send(g);
        })
        .catch( (err) => {
            res.sendStatus(404);
        });    
});

router.post('/', auth, asyncMiddleware((req, res) => {
    // check request body
    var result = validate(req.body);

    if (result.error) {
        res.status(400).send('Bad request: ' + result.error.details[0].message);
        return;
    }

    createGenre(req.body).then( (g) => {
        dbDebugger('This came from the function: ', g);
        res.send(g);
    });
}));

router.put('/:id', auth, asyncMiddleware((req, res) => {

    // check if input has right format
    var result = validate(req.body);

    if (result.error){
        res.status(400).send('Error: ' + result.error);
        return;
    }

    updateGenre(req.params.id, req.body.name)
        .then((g) => res.send(g))
        .catch((err) => res.send(err.message));
}));

router.delete('/:id',[auth, admin], (req, res) => {
    deleteGenre(req.params.id)
        .then((g) => res.send(g))
        .catch(() => res.sendStatus(404));
})

module.exports = router;