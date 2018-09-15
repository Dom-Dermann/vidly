// import modules
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const dbDebugger = require ('debug')('app:db');

// create CRUD operations for MongoDB
async function getAllGenres(){
    const genres = await Genre
        .find()
        .sort('genre');
    return genres;
}

async function getSpecificGenre(id) {
    const genres = await Genre
        .find({_id: id});
    return genres;
}

async function createGenre(body){

    const genre = new Genre({
        name: body.name
    });

    try {
        const saveResult = await genre.save();
        dbDebugger('You just saved this genre: ', saveResult);
    } catch (ex) {
        for ( field in ex.errors) {
            dbDebugger(ex.errors[field].message); 
        }
    }
    return genre;
}

async function updateGenre(id, newName) {
    const genre = await Genre   
        .findById('5b817642e455ce219c37a9aa', function (err, g) {
            if (err) return err;

            g.name = newName;
            g.save(function (err, updatedGenre) {
                return updatedGenre;
            });
        });

    return genre;
}

async function deleteGenre(id) {
    const genre = await Genre
        .findOneAndRemove({ _id: id});
    return genre;
}


// create express routing operations
router.get('/', async (req, res) => {
    const genres = await Genre
        .find()
        .sort('genre')
        .then((g) => {
            res.send(g)
        })
        .catch((err) => {
            res.send(err)
        })
});

router.get('/:id', (req, res) => {
    getSpecificGenre(req.params.id)
        .then( (g) => {
            res.send(g);
        })
        .catch( (err) => {
            res.sendStatus(404);
        });    
});

router.post('/', auth, (req, res) => {
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
});

router.put('/:id', auth, (req, res) => {

    // check if input has right format
    var result = validate(req.body);

    if (result.error){
        res.status(400).send('Error: ' + result.error);
        return;
    }

    updateGenre(req.params.id, req.body.name)
        .then((g) => res.send(g))
        .catch((err) => res.send(err.message));
});

router.delete('/:id', (req, res) => {
    deleteGenre(req.params.id)
        .then((g) => res.send(g))
        .catch(() => res.sendStatus(404));
})

module.exports = router;