var express = require('express');
var mongoose = require('mongoose');
var User = require('./user')
var app = express();

var Schema = mongoose.Schema;

var incidentSchema = new Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
	description : { 
		collateral: Boolean,
		injury: Boolean,
		other: Boolean
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

module.exports = mongoose.model("Incident", incidentSchema);


