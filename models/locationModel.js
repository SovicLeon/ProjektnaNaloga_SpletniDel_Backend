var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var locationSchema = new Schema({
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'longitude' : Number,
	'latitude' : Number,
	'timestamp' : Date
});

module.exports = mongoose.model('location', locationSchema);
