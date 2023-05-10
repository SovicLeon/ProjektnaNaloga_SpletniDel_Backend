var locationModel = require('../models/locationModel.js');

/**
 * locationController.js
 *
 * @description :: Server-side logic for managing locations.
 */
module.exports = {

    /**
     * locationController.list()
     */
    list: function (req, res) {
        locationModel.find()
        .populate('postedBy')
        .exec(function (err, locations) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting location.',
                    error: err
                });
            }
            var data = [];
            data.locations = locations;
            //return res.render('location/list', data);
            return res.json(locations);
        });
    },

    /**
     * locationController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        locationModel.findOne({_id: id}, function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting location.',
                    error: err
                });
            }

            if (!location) {
                return res.status(404).json({
                    message: 'No such location'
                });
            }

            return res.json(location);
        });
    },

    /**
     * locationController.create()
     */
    create: function (req, res) {
        var location = new locationModel({
			postedBy : req.session.userId,
            longitude : req.body.longitude,
            latitude : req.body.latitude,
            timestamp : new Date()
        });

        location.save(function (err, location) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating location',
                    error: err
                });
            }

            return res.status(201).json(location);
            //return res.redirect('/locations');
        });
    },

    /**
     * locationController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        locationModel.findByIdAndRemove(id, function (err, location) {
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
