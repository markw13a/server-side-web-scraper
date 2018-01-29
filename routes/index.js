var express = require('express');
var router = express.Router();
var opportunitiesController = require('../controllers/opportunitiesController');

/* GET home page. */
router.get('/', opportunitiesController.index);

module.exports = router;
