var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sectionTrafficSchema = new Schema({
	'fromSection' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'section'
	},
	'speed' : Number,
	'numOfVehicles' : Number,
	'timeBetweenVehicles' : Number,
	'timestamp' : Date
});

module.exports = mongoose.model('sectionTraffic', sectionTrafficSchema);