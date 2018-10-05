const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get('/', function(req, res){
	res.render('markw13a-index');
});

router.post('/send-message', messageController.send);

module.exports = router;
