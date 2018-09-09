var express = require('express');
var mongoose = require('mongoose');
var app = express();

var Schema = mongoose.Schema;

var storageSchema = new Schema({
	userStorage: {type: Number, required: true}
});

module.exports = mongoose.model("Storage", storageSchema);