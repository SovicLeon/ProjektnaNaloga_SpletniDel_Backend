var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sectionTrafficSchema = new Schema({
	'fromSection' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'section'
	},
	'location' : String,
	'numOfVehicles' : Number,
	'speed' : Number,
	'timeBetweenVehicles' : Number,
	'congestion' : Number,
	'timestamp' : Date
});

module.exports = mongoose.model('sectionTraffic', sectionTrafficSchema);