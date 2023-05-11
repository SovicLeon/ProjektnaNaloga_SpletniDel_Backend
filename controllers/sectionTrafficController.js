var sectionTrafficModel = require('../models/sectionTrafficModel.js');

/**
 * sectionTrafficController.js
 *
 * @description :: Server-side logic for managing sectionTraffics.
 */
module.exports = {

    /**
     * sectionTrafficController.list()
     */
    list: function (req, res) {
        sectionTrafficModel.find()
        .populate('fromSection')
        .exec(function (err, sectionTraffics) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting sectionTraffic.',
                    error: err
                });
            }
            var data = [];
            data.sectionTraffics = sectionTraffics;
            //return res.render('sectionTraffic/list', data);
            return res.json(sectionTraffics);
        });
    },

    /**
     * sectionTrafficController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        sectionTrafficModel.findOne({_id: id}, function (err, sectionTraffic) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting sectionTraffic.',
                    error: err
                });
            }

            if (!sectionTraffic) {
                return res.status(404).json({
                    message: 'No such sectionTraffic'
                });
            }

            return res.json(sectionTraffic);
        });
    },

    /**
     * sectionTrafficController.create()
     */
    create: function (req, res) {
        // Find the section document by its _id
        Section.findById(req.params.sectionId, function(err, section) {
          if (err) {
            // Handle error
            return res.status(500).send(err);
          }
      
          // Create a new sectionTrafficModel document with the section ObjectId
          var sectionTraffic = new sectionTrafficModel({
            fromSection: section._id, // Set fromSection to section ObjectId
            speed: req.body.speed,
            numOfVehicles: req.body.numOfVehicles,
            timeBetweenVehicles: req.body.timeBetweenVehicles, 
            timestamp: new Date()
          });
      
          // Save the new sectionTrafficModel document
          sectionTraffic.save(function(err) {
            if (err) {
              // Handle error
              return res.status(500).send(err);
            }
      
            // Return a success response
            return res.status(201).json(sectionTraffic);
          });
        });
      },

    /**
     * sectionTrafficController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        sectionTrafficModel.findByIdAndRemove(id, function (err, sectionTraffic) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the sectionTraffic.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
};
