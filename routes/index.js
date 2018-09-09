var express = require('express');
var User = require('../models/user');
var Incident = require('../models/incident');
var router = express.Router();
var bodyParser = require('body-parser');
var Storage = require('../models/storage')
var mongoose = require('mongoose');

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
	 	var resolvedHigh = 0;
	 	var resolvedMed = 0;
	 	var resolvedLow = 0;
	 	Storage.find({}, function(err, storage){
	 		maxSev = storage[0];
	 		Incident.find({}, function(err, incidents){
		 		incidents.forEach((incident) => {
		 			if(!incident.resolved){
		 				if (Math.abs(incident.coordinates.lat - req.body.coordinates.lat) <= 0.5 && Math.abs(incident.coordinates.long - req.body.coordinates.long) <= 0.5){
		 					returnStatement.push(incident);
		 				}
		 			}else if(incident.resolved = true &&  Math.abs(incident.coordinates.lat - req.body.coordinates.lat) <= 0.5 && Math.abs(incident.coordinates.long - req.body.coordinates.long) <= 0.5){
		 				if(incident.currentPriority === 3){
		 					resolvedHigh += 1;
		 				}else if(incident.currentPriority === 2){
		 					resolvedMed += 1;
		 				}else if(incident.currentPriority === 1){
		 					resolvedLow += 1;
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

	 			var weightedSum = resolvedHigh*.5 + resolvedMed*.37 + resolvedLow*.24; 
	 			console.log(weightedSum, resolvedHigh, resolvedMed, resolvedLow);
 				if (weightedSum > maxSev.userStorage){
 					maxSev.userStorage = weightedSum;
 					Storage.update({},{$set:{userStorage:maxSev.userStorage}}, function(err, numAff, raw){
 						if(err) console.log(err);
 						console.log(numAff)
 					});
 				}
	 			console.log(maxSev.userStorage);
	 			sevFactor = weightedSum/maxSev.userStorage;
	 			console.log(sevFactor);
	 			var normal = Math.floor(sevFactor*10);
	 			var riskFactor;
	 			if (normal === 1){
	 				riskFactor = 1;
	 			}else if (normal === 2){
	 				riskFactor = 2;
	 			}else if (normal === 3){
	 				riskFactor = 3;
	 			}else if (normal === 4){
	 				riskFactor = 4;
	 			}else if (normal === 5){
	 				riskFactor = 5;
	 			}else if (normal === 6){
	 				riskFactor = 6;
	 			}else if (normal === 7){
	 				riskFactor = 7;
	 			}else if (normal === 8){
	 				riskFactor = 8;
	 			}else if (normal === 9){
	 				riskFactor = 9;
	 			}else if (normal === 10){
	 				riskFactor = 10;
	 			}
	 			console.log(riskFactor);

	 		
	 			res.send(JSON.stringify({incidents: returnStatement, report: {food: numFood, injury: numInjury, other: numOther}, SeverityFactor: riskFactor}));
	 		});
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

	 router.post('/metrics', function(res, req, next){
	 	var resolvedHigh = 0;
	 	var resolvedMed = 0;
	 	var resolvedLow = 0;
	 	Incident.find({}, function(err, incidents){
	 		incidents.forEach((incident) => {
	 			if(incident.resolved && incident.currentPriority === 3){
	 				resolvedHigh += 1;
	 			}
	 			if(incident.resolved && incident.currentPriority === 2){
	 				resolvedMed += 1;
	 			}
	 			if(incident.resolved && incident.currentPriority === 1){
	 				resolvedLow += 1;
	 			}
	 		});
	 	});
	 });

	 	return router;

	 }

