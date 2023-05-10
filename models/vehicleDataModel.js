var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var vehicleDataSchema = new Schema({
	'longitude' : Number,
	'latitude' : Number,
	'gyro_x' : Number,
    'gyro_y' : Number,
    'gyro_z' : Number,
    'acc_acceleration' : Number,
    'acc_x' : Number,
    'acc_y' : Number,
    'acc_z' : Number,
    'timestamp' : Date,
    'postedBy' : {
        type: Schema.Types.ObjectId,
        ref: 'user'
   },
});

module.exports = mongoose.model('vehicleData', vehicleDataSchema);