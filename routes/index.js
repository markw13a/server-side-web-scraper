var express = require('express');
var router = express.Router();
var opportunitiesController = require('../controllers/opportunitiesController');

router.get('/', opportunitiesController.index);

//Optionaly allow user to sort results by the given category
router.get('/:sortBy', opportunitiesController.index);

module.exports = router;
