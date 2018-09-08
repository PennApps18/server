var express = require('express');
var mongoose = require('mongoose');
var User = require('./user')
var app = express();

var Schema = mongoose.Schema;

var incidentSchema = new Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
	description : { 
		food: Boolean,
		injury: Boolean,
		other: Boolean
	},
	coordinates: {
		long : Number,
		lat : Number
	},
	currentPriority : { type: Number, required: false }
});

module.exports = mongoose.model("Incident", incidentSchema);


