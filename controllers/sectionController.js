var sectionModel = require('../models/sectionModel.js');

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
            var data = [];
            data.sections = sections;
            //return res.render('section/list', data);
            return res.json(sections);
        });
    },

    /**
     * sectionController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        sectionModel.findOne({_id: id}, function (err, section) {
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
			postedBy : req.session.userId,
            acc_average : req.body.acc_average,
            acc_max : req.body.acc_max,
            acc_min : req.body.acc_min,
            start_pos : req.body.start_pos,
            end_pos : req.body.end_pos,
            duration : req.body.duration,
            time : req.body.time, 
            timestamp : new Date()
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
