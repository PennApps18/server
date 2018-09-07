var express = require('express');
var mongoose = require('mongoose');
var app = express();

var Schema = mongoose.Schema;

var userInfoSchema = new Schema({
	username: { type: String, required: true },
	coordinates: {
		long : { type: Number, required: true },
		lat : { type : Number, required: true }
	},
	currentPriority : { type: Number, required: true }
});

module.exports = mongoose.model("User", userInfoSchema);


