var express = require('express');
var mongoose = reuqire('mongoose');
var app = express();

var schema = mongoose.schema;

var userInfoSchema = new Schema({
	userName: {type: String, required: true},
	coordinates: {
		long : { type: Number, required: true },
		lat : { type : Number, required: true }
	},
	currentPriority : {type: Number, required: true}
});

module.exports = mongoose.model("User", userInfoSchema);


