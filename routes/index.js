var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*
 * @params username of user
 * @params new set of coordinates to update
 * 
 */
router.post('/updateLocation', function(req, res, next){
	User.findOne({ username : req.body.username }, function (err, user){
		if (user) {
			user.coordinates = req.body.coordinates;
			user.save();

			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringiy(user));
		} else {
			return res.status(400).end('User does not exist')
		}
	});
});

module.exports = router;
