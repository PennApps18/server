var express = require('express');
var mongoose = require('mongoose');
var User = require('./user')
var app = express();

var Schema = mongoose.Schema;

var incidentSchema = new Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	description : { 
		food : {type : Boolean, required: false},
		injury : {type : Boolean, required: false},
		other : {type : Boolean, required: false}
	},
	coordinates: {
		long : { type: Number, required: false },
		lat : { type : Number, required: false }
	},
	currentPriority : { type: Number, required: false }
});

module.exports = mongoose.model("Incident", incidentSchema);


