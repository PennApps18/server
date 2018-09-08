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
	 			res.end();
	 		}
	 	});
	 });

	 router.post('/range', function(req, res, next){
	 	var returnStatement  = [];
	 	var numFood = 0;
 		var numInjury = 0;
 		var numOther = 0;
	 	Incident.find({}, function(err, incidents){
	 		incidents.forEach((incident) => {
	 			if(!incident.resolved){
	 				if (Math.abs(incident.coordinates.lat - req.body.coordinates.lat) <= 0.5 && Math.abs(incident.coordinates.long - req.body.coordinates.long) <= 0.5){
	 					returnStatement.push(incident);
	 				}
	 			}
		
	 			if (incident.description.food){
	 				numFood += 1;
	 			} else if (incident.description.injury){
	 				numInjury += 1;
	 			} else if (incident.description.other){
	 				numOther += 1;
	 			}

	 		});
	 		res.send(JSON.stringify({incidents: returnStatement, report: {food: numFood, injury: numInjury, other: numOther}}));
	 	});


	 });

	 router.post('/storedUsers', function(req, res, next){
	 	var dbUser = new Incident();
	 	dbUser.user = req.body.user;
	 	dbUser.description = req.body.description;
	 	dbUser.coordinates = req.body.coordinates;
	 	dbUser.currentPriority = req.body.currentPriority;
	 	dbUser.resolved = false;
	 	dbUser.image = req.body.image;

	 	dbUser.save();

	 	io.emit("incidentUpdate", dbUser);
	 	res.status(200).end("end");
	 });

	 router.post('/resolveIncident', function (req, res, next){
	 	const id = req.body.incidentId;
	 	Incident.findById(id, function (err, incident){
	 		incident.resolved = true;
	 		incident.save();
	 		res.status(200).end("Resolve Succ");
	 	});
	 });

	 return router;

	}

