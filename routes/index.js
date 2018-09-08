var express = require('express');
var User = require('../models/user');
var Incident = require('../models/incident');
var router = express.Router();
var bodyParser = require('body-parser');

module.exports = function(io){

	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render('index', { title: 'Express' });
	});
	/*
	 * @params username of user
	 * @params new set of coordinates to update 
	 */
	router.post('/updateLocation', function(req, res, next){
		User.findOne({ username : req.body.username }, function (err, user){
			if (user) {
				user.coordinates = req.body.coordinates;
				user.save();

				res.writeHead(200, {"Content-Type": "application/json"});
				res.end(JSON.stringify(user));
			} else {
				return res.status(400).end('User does not exist')
			}
		});
	});

	router.get('/users', function (req, res, next){
		User.find({}, (err, users) => {
			if (err) {
				res.type('html').status(500);
				res.send("Error" + err);
			} else {
				console.log(users);
				res.send(JSON.stringify(users));
			}
		});
	});

	router.post('/range', function(req, res, next){
		var returnStatement  = [];
		Incident.forEach((incident) => {
			if ((incident.coordinates.lat - user.coordinates.lat >= 0.5) && (incident.coordinates.long - user.coordinates.long >= 0.5));
			returnStatment.push(incident);
		});
		res.send(JSON.stringify(incident));
	});

router.post('/storedUsers', function(req, res, next){
	var dbUser = new Incident();
		dbUser.user = req.body.user;
		dbUser.description = req.body.description;
		dbUser.coordinates = req.body.coordinates;

		dbUser.save();
		
	User.findById(req.body.user, function (err, user){
			var s = user.subscribers;
			
	})
	res.status(200);
});

return router;

}

