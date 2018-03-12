var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messageController');

router.get('/', function(req, res){
	res.render('markw13a-index');
});

router.post('/send-message', messageController.send);

module.exports = router;
