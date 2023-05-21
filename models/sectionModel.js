var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sectionSchema = new Schema({
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'acc_average' : Number,
	'acc_max' : Number,
	'acc_min' : Number,
    'start_pos_lat' : Number,
	'start_pos_lon' : Number,
	'end_pos_lat' : Number,
	'end_pos_lon' : Number,
	'duration' : Number,
	'time' : Date,
    'timestamp' : Date
});

module.exports = mongoose.model('section', sectionSchema);