var express = require('express');
var router = express.Router();
var opportunitiesController = require('../controllers/opportunitiesController');

router.get('/', opportunitiesController.index);

module.exports = router;
