// import modules
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const config = require('config');
const dbDebugger = require ('debug')('app:db');
const mongoose = require('mongoose');

const genres = [
    {
        id: 1, 
        genre: 'horror'
    },
    {
        id: 2, 
        genre: 'romance'
    }
];

// get the db host path
const dbHost = config.get('Database.host');
dbDebugger(dbHost);

// connect to db host path
mongoose.connect(dbHost)
    .then( () => dbDebugger(`Connected to MongoDB at ${dbHost}`))
    .catch( () => dbDebugger('Error connecting to database'));

// create schema for data to be saved
const genreSchema = new mongoose.Schema({
    genre: {
        type: String, 
        required: true,
        minlength: 3, 
        maxlength: 30
    }
});

const Genre = mongoose.model('Genre', genreSchema);

// create CRUD operations for MongoDB
async function getAllGenres(){
    const genres = await Genre
        .find({});
    return genres;
}

async function getSpecificGenre(id) {
    const genres = await Genre
        .find({_id: id});
    return genres;
}

async function createGenre(body){

    const genre = new Genre({
        genre: body.genre
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


// TODO: this function is where you left off
async function updateGenre(id, newName) {
    const genre = await Genre   
        .findById('5b817642e455ce219c37a9aa', function (err, g) {
            if (err) return err;

            g.genre = newName;
            g.save(function (err, updatedGenre) {
                return updatedGenre;
            });
        });

    return genre;
}


// create express routing operations
router.get('/', (req, res) => {
    getAllGenres().then( (g) => {
        res.send(g);
    });
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

router.post('/', (req, res) => {
    var result = checkSchema(req.body);

    if (result.error) {
        res.status(400).send('Bad request: ' + result.error.details[0].message);
        return;
    }

    createGenre(req.body).then( (g) => {
        dbDebugger('This came from the function: ', g);
        res.send(g);
    });
});

router.put('/:id', (req, res) => {

    // check if input has right format
    var result = checkSchema(req.body);

    if (result.error){
        res.status(400).send('Error: ' + result.error);
        return;
    }

    updateGenre(req.params.id, req.body.genre)
        .then((g) => res.send(g))
        .catch((err) => res.send(err.message));
});

router.delete('/:id', (req, res) => {
    const index = genres.findIndex((g) => g.id === parseInt(req.params.id));
    if (index === -1) {
        res.sendStatus(404);
    }
    const itemDeleted = genres[index];

    genres.splice(index, 1);
    res.send(itemDeleted);
})

function checkSchema(body) {
    const schema = {
        genre : Joi.string().min(3).required()
    };

    var result = Joi.validate(body, schema);
    return result;
}

module.exports = router;