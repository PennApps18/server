var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var User = require('./models/user')
var Incident = require('./models/incident')
var Storage = require('./models/storage')
var mongoose = require('mongoose');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');

require('./config/socket')(io);
require('./config/pushNotifications');
var indexRouter = require('./routes/index')(io);

mongoose.connect(process.env.MLAB_URI || "mongodb://savan:123robot@ds149742.mlab.com:49742/pennapps18", function (err) {
	if(err) console.log(err);
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback) => {
	console.log('connection succ');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(process.env.PORT || 7900);

var Schema = mongoose.Schema;
var incidentSchema = new Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
	description : { 
		food: Boolean,
		injury: Boolean,
		other: Boolean,
		fire: Boolean,
		flooding: Boolean,
		earthquake: Boolean
	},
	coordinates: {
		long : Number,
		lat : Number
	},
	time : Date,
	resolved: Boolean,
	currentPriority : { type: Number, required: false },
	image : { type: Buffer, required: false }
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}
for(var i = 0; i < 30; i ++){
	var incident = new Incident();
	incident.user = "5b930ba168081e9b04c952ff"
	var random = getRandomInt(1,6)
	switch (random){
		case 1:
			incident.description.food = true
			break;
		case 2:
			incident.description.injury = true
			break;
		case 3:
			incident.description.other = true
			break;
		case 4:
			incident.description.earthquake = true
			break;
		case 5:
			incident.description.fire = true
			break;
		case 6:
			incident.description.flooding = true
			break;
	}
	incident.time = Date.now();

	incident.coordinates = {
		lat: getRandom(39.952018680567924-0.5,39.952018680567924+0.5),
		long: getRandom(-75.19030806990608-0.5, -75.19030806990608+0.5),
	// }
	// incident.coordinates = {
	// 	lat: getRandom(44-0.5,44+0.5),
	// 	long: getRandom(-78-0.5, -78+0.5),
	}
	incident.currentPriority = getRandomInt(1,3)
	//incident.currentPriority = 1;
	
	var reso = getRandomInt(1,2)
	switch (reso){
		case 1:
			incident.resolved = true
			break;
		case 2:
			incident.resolved = false
			break;
	}

	incident.save();

	console.log(incident)
 }

var s = new Storage();
s.userStorage = -1;
s.save();

module.exports = app;