var vehicleDataModel = require('../models/vehicleDataModel.js');
var sectionModel = require('../models/sectionModel.js');

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
    processTime: function (req, res) {
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

    processDistance: function (req, res) {
        var vehicleData = new vehicleDataModel({
            postedBy: req.session.userId,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            gyro_x: req.body.gyro_x,
            gyro_y: req.body.gyro_y,
            gyro_y: req.body.gyro_z,
            acc_acceleration: req.body.acc_acceleration,
            acc_x: req.body.acc_x,
            acc_y: req.body.acc_y,
            acc_z: req.body.acc_z,
            timestamp: new Date()
        });
    
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
    
    
            // sort timestamps in ascending order            
            const sortedTimestampsDesc = vehicleDataFind.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
            
            for (let i = 0; i < sortedTimestampsDesc.length; i++) {
                let dist = haversineDistance([req.body.latitude, req.body.longitude], [sortedTimestampsDesc[i].latitude, sortedTimestampsDesc[i].longitude]);
                if (dist > 10) {
                    break;
                }
                console.log("Dist: " + dist);
            }
    
            vehicleData.save(function (err, vehicleData) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating vehicleData',
                        error: err
                    });
                }
    
                return res.status(201).json(vehicleData);
            });
        });
    },

    process: function (req, res) {
        // Get start and end time from the request
        var startTime = new Date(req.body.start);
        var endTime = new Date(req.body.end);
        
        // Query vehicle data in the given time range for the user
        vehicleDataModel.find({ 
            postedBy: req.session.userId,
            timestamp: { $gte: startTime, $lte: endTime }
        }).sort('timestamp').exec(function (err, vehicleDataFind) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting vehicleData found for user.',
                    error: err
                });
            }
    
            if (!vehicleDataFind || vehicleDataFind.length == 0) {
                return res.status(404).json({
                    message: 'No such vehicleData found for user.'
                });
            }
    
            // Function to create section
            const createSection = (start, end, accSum, accMax, accMin, i) => {
                let duration = (end.timestamp - start.timestamp) / 1000; // duration in seconds
                var section = new sectionModel({
                    postedBy : req.session.userId,
                    acc_average : accSum / i,
                    acc_max : accMax,
                    acc_min : accMin,
                    start_pos_lat : start.latitude,
                    start_pos_lon : start.longitude,
                    end_pos_lat : end.latitude,
                    end_pos_lon : end.longitude,
                    duration : duration,
                    time : start.timestamp,
                    timestamp : new Date()
                });
    
                section.save(function (err, section) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating section',
                            error: err
                        });
                    }
                });
            }
    
            // Variables to hold section data
            let sectionStart = vehicleDataFind[0];
            let totalDistance = 0;
            let accSum = 0, accMax = -Infinity, accMin = Infinity;
            let counter = 0;
            
            // Create sections
            for (let i = 1; i < vehicleDataFind.length; i++) {
                let dist = haversineDistance(
                    [sectionStart.latitude, sectionStart.longitude], 
                    [vehicleDataFind[i].latitude, vehicleDataFind[i].longitude]
                );
    
                totalDistance += dist;
                accSum += vehicleDataFind[i].acc_acceleration;
                accMax = Math.max(accMax, vehicleDataFind[i].acc_acceleration);
                accMin = Math.min(accMin, vehicleDataFind[i].acc_acceleration);
                counter++;
    
                // Create new section if total distance is equal to or exceeds distance
                if (totalDistance >= 0.25) {
                    createSection(sectionStart, vehicleDataFind[i], accSum, accMax, accMin, counter);
                    // Reset for next section
                    sectionStart = vehicleDataFind[i];
                    totalDistance = 0;
                    accSum = 0;
                    accMax = -Infinity;
                    accMin = Infinity;
                    counter = 0;
                }
            }
    
            // Create last section if there's remaining data
            if (counter > 0) {
                createSection(sectionStart, vehicleDataFind[vehicleDataFind.length - 1], accSum, accMax, accMin, counter);
            }
    
            return res.status(200).json({
                message: 'Data processed successfully',
                dataCount: vehicleDataFind.length
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

// Haversine formula
function haversineDistance(coords1, coords2) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    var lon1 = coords1[1];
    var lat1 = coords1[0];

    var lon2 = coords2[1];
    var lat2 = coords2[0];

    var R = 6371; // Radius of the earth in km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);  
    var x2 = lon2 - lon1;
    var dLon = toRad(x2);
    
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    var d = R * c; 

    return d;
}