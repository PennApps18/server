var express = require('express');
var app = express();

var schema = mongoose.schema;

var userInfoSchema = new Schema( {
	userName: {type: String, required: true},
	location: {type: String, required: true}
});

var user = mongoose.model("User", userInfoSchema);

var newUser = new User ({
	userName: req.body.userName,
	location: req.body.location
});

