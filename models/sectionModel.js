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
    'start_pos' : Number,
	'end_pos' : Number,
	'duration' : Number,
    'timestamp' : Date
});

module.exports = mongoose.model('section', sectionSchema);