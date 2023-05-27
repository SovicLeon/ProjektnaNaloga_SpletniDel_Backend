var sectionModel = require('../models/sectionModel.js');
var sectionTrafficModel = require('../models/sectionTrafficModel');

/**
 * sectionController.js
 *
 * @description :: Server-side logic for managing sections.
 */
module.exports = {

    /**
     * sectionController.list()
     */
    list: function (req, res) {
        sectionModel.find()
            .populate('postedBy')
            .exec(function (err, sections) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting section.',
                        error: err
                    });
                }

                // Array to hold the modified sections data
                var data = [];
                data.sections = [];

                // Iterate over each section and populate sectionTraffic
                sections.forEach(function (section) {
                    sectionTrafficModel.findOne({ fromSection: section._id }, function (err, sectionTraffic) {
                        if (err) {
                            console.log('Error when getting sectionTraffic:', err);
                        }

                        // Create a modified section object with sectionTraffic included
                        var modifiedSection = {
                            _id: section._id,
                            postedBy: section.postedBy,
                            acc_average: section.acc_average,
                            acc_max: section.acc_max,
                            acc_min: section.acc_min,
                            start_pos_lat: section.start_pos_lat,
                            start_pos_lon: section.start_pos_lon,
                            end_pos_lat: section.end_pos_lat,
                            end_pos_lon: section.end_pos_lon,
                            duration: section.duration,
                            time: section.time,
                            timestamp: section.timestamp,
                            sectionTraffic: sectionTraffic || null // Include sectionTraffic or null if it doesn't exist
                        };

                        // Add the modified section to the data array
                        data.sections.push(modifiedSection);

                        // Check if all sections have been processed
                        if (data.sections.length === sections.length) {
                            // Return the modified sections data
                            return res.json(data.sections);
                        }
                    });
                });
            });
    },

    /**
     * sectionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        sectionModel.findOne({ _id: id }, function (err, section) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting section.',
                    error: err
                });
            }

            if (!section) {
                return res.status(404).json({
                    message: 'No such section'
                });
            }

            return res.json(section);
        });
    },

    /**
     * sectionController.create()
     */
    create: function (req, res) {
        var section = new sectionModel({
            postedBy: req.session.userId,
            acc_average: req.body.acc_average,
            acc_max: req.body.acc_max,
            acc_min: req.body.acc_min,
            start_pos_lat: req.body.start_pos_lat,
            start_pos_lon: req.body.start_pos_lon,
            end_pos_lat: req.body.end_pos_lat,
            end_pos_lon: req.body.end_pos_lon,
            duration: req.body.duration,
            time: req.body.time,
            timestamp: new Date()
        });

        section.save(function (err, section) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating section',
                    error: err
                });
            }

            return res.status(201).json(section);
            //return res.redirect('/sections');
        });
    },

    /**
     * sectionController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        sectionModel.findByIdAndRemove(id, function (err, section) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the section.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
};
