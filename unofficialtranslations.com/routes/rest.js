const express = require('express');
const credentials = require('../resources/credentials');

const router = express.Router();
const adminPassword = credentials.rest.password;

// form for creating new article
router.get('/create-new', (req, res) => {
	res.render('rest-submit');
});

// retrieve  item from back-end
router.get('/', (req, res) => {
    console.warn("GET", req);
});

// write item to back-end if correct password provided
router.post('/', (req, res) => {
    const {password} = req.body;

    // {
    //     endpoint-title: "",
    //     content : {
    //         [{language: "en", text: "...", title: "..."}, {language: "es", text: "...", title: "..."}]
    //     },
    //     link: "..." // link to original text
    // }

    if(password !== adminPassword) res.send('Incorrect Password. New item not created')
    
    // Create entry for item in back-end 

    // Success. Link to new asset's endpoint
    res.send('Item successfully created');
});

module.exports = router;
