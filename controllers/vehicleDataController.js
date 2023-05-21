var vehicleDataModel = require('../models/vehicleDataModel.js');

/**
 * vehicleDataController.js
 *
 * @description :: Server-side logic for managing vehicle data.
 */
module.exports = {

    /**
     * vehicleDataController.list()
     */
    list: function (req, res) {
        vehicleDataModel.find()
        .populate('postedBy')
        .exec(function (err, vehicleData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vehicleData.',
                    error: err
                });
            }
            var data = [];
            data.vehicleData = vehicleData;
            //return res.render('vehicleData/list', data);
            return res.json(vehicleData);
        });
    },

    /**
     * vehicleDataController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        vehicleDataModel.findOne({_id: id}, function (err, vehicleData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vehicleData.',
                    error: err
                });
            }

            if (!vehicleData) {
                return res.status(404).json({
                    message: 'No such vehicleData'
                });
            }

            return res.json(vehicleData);
        });
    },

    getLastLocation: function (req, res) {
        vehicleDataModel.findOne({ postedBy: req.session.userId })
            .sort({ timestamp: -1 })
            .exec(function (err, vehicleData) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting vehicleData.',
                        error: err
                    });
                }
    
                if (!vehicleData) {
                    return res.status(404).json({
                        message: 'No such vehicleData'
                    });
                }
    
                return res.json(vehicleData);
            });
    },

    getLastDrive: function (req, res) {
        vehicleDataModel.find({ postedBy: req.session.userId })
            .sort({ timestamp: -1 })
            .exec(function (err, vehicleData) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting vehicleData.',
                        error: err
                    });
                }
    
                if (!vehicleData) {
                    return res.status(404).json({
                        message: 'No such vehicleData'
                    });
                }
    
                return res.json(vehicleData);
            });
    },  

    /**
     * vehicleDataController.create()
     */
    process: function (req, res) {
        var vehicleData = new vehicleDataModel({
            postedBy: req.session.userId,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            gyro_x: req.body.gyro_x,
            gyro_y: req.body.gyro_y,
            gyro_z: req.body.gyro_z,
            acc_acceleration: req.body.acc_acceleration,
            acc_x: req.body.acc_x,
            acc_y: req.body.acc_y,
            acc_z: req.body.acc_z,
            timestamp: new Date()
        });
    
        var timeTreshold = 10;
    
        vehicleDataModel.find({ postedBy: req.session.userId }, function (err, vehicleDataFind) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vehicleData found for user.',
                    error: err
                });
            }
    
            if (!vehicleDataFind) {
                return res.status(404).json({
                    message: 'No such vehicleData found for user.'
                });
            }
    
            console.log(vehicleDataFind.length);
    
            if (vehicleDataFind.length > 0) {
                console.log(vehicleDataFind)
            }

            // sort timestamps in ascending order            
            const sortedTimestampsDesc = vehicleDataFind.sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
            });
            
            const latestTimestamp = sortedTimestampsDesc[0].timestamp;
            const earliestTimestamp = sortedTimestampsDesc[sortedTimestampsDesc.length-1].timestamp;
            
            console.log("Earliest timestamp:", earliestTimestamp);
            console.log("Latest timestamp:", latestTimestamp);

            // calculate the time difference in milliseconds
            const timeDiffInMs = latestTimestamp - earliestTimestamp;

            // convert the time difference to a human-readable format
            const seconds = Math.floor(timeDiffInMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            console.log(timeDiffInMs);

            console.log(`Time difference: ${days} days, ${hours % 24} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`);
    
            // Save the new vehicle data
            vehicleData.save(function (err, vehicleData) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating vehicleData',
                        error: err
                    });
                }
    
                return res.status(201).json(vehicleData);
                //return res.redirect('/vehicleDatas');
            });
        });
    },
    

    /**
     * vehicleDataController.create()
     */
    create: function (req, res) {
        var vehicleData = new vehicleDataModel({
            postedBy : req.session.userId,                                    
            longitude : req.body.longitude,
            latitude : req.body.latitude,
            gyro_x : req.body.gyro_x,
            gyro_y : req.body.gyro_y,
            gyro_z : req.body.gyro_z,
            acc_acceleration : req.body.acc_acceleration,
            acc_x : req.body.acc_x,
            acc_y : req.body.acc_y,
            acc_z : req.body.acc_z,
            timestamp : new Date()
        });

        vehicleData.save(function (err, vehicleData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating vehicleData',
                    error: err
                });
            }

            return res.status(201).json(vehicleData);
            //return res.redirect('/vehicleDatas');
        });
    },

    /**
     * vehicleDataController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        vehicleDataModel.findByIdAndRemove(id, function (err, vehicleData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the vehicleData.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
};
