const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Vidly.com is a great server. Use our API to get info.');
});

module.exports = router;