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
                    message: 'Error when getting location.',
                    error: err
                });
            }
            var data = [];
            data.vehicleData = vehicleData;
            //return res.render('location/list', data);
            return res.json(vehicleData);
        });
    },

    /**
     * locationController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        vehicleDataModel.findOne({_id: id}, function (err, vehicleData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting location.',
                    error: err
                });
            }

            if (!vehicleData) {
                return res.status(404).json({
                    message: 'No such location'
                });
            }

            return res.json(vehicleData);
        });
    },

    /**
     * locationController.create()
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
                    message: 'Error when creating location',
                    error: err
                });
            }

            return res.status(201).json(vehicleData);
            //return res.redirect('/locations');
        });
    },

    /**
     * locationController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        vehicleDataModel.findByIdAndRemove(id, function (err, vehicleData) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the location.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
};
