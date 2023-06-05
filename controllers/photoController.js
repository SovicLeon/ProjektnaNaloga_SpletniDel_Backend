var PhotoModel = require('../models/photoModel.js');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
        .populate('postedBy')
        .exec(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var data = [];
            data.photos = photos;
            //return res.render('photo/list', data);
            return res.json(photos);
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            return res.json(photo);
        });
    },

    /**
     * photoController.create()
     */

    create: function (req, res) {
        var photo = new PhotoModel({
            path: "/images/" + req.file.filename,
            postedBy: req.session.userId,
        });
        
        var testPassed = false;

        fs.access(`public/images/${req.session.userId}/${req.session.userId}.sav`, fs.constants.F_OK, (err) => {
            if (err) {
                const createModelScript = spawn('python', ['python/faceCreateModel.py', `public/images/${req.session.userId}`, "python/faces_false", `public/images/${req.session.userId}/${req.session.userId}`]);
                createModelScript.stdout.on('data', (data) => {
                    // Process and handle the output from the Python script
                    const result = data.toString();
                    console.log(result);
                });
                createModelScript.stderr.on('data', (data) => {
                    const error = data.toString();
                    console.log(error);
                });
            } else {
                const files = fs.readdirSync(path.join('public/images', req.session.userId));
                const sortedFiles = files.map((filename) => {
                    const filePath = path.join('public/images', req.session.userId, filename);
                    const stat = fs.statSync(filePath);
                    return {
                        filename,
                        createdAt: stat.birthtimeMs,
                    };
                }).sort((a, b) => b.createdAt - a.createdAt);
                const recentImage = sortedFiles[0].filename;
                const faceTestScript = spawn('python', ['python/faceTestImage.py', `public/images/${req.session.userId}/${req.session.userId}.sav`, `public/images/${req.session.userId}/${recentImage}`]);
                faceTestScript.stdout.on('data', (data) => {
                    const result = data.toString();
                    if (result.trim() === 'TRUE') {
                        testPassed = true;
                    } else {
                        testPassed = false;
                    }
                });
                faceTestScript.stderr.on('data', (data) => {
                    const error = data.toString();
                    console.log(error);
                });
                faceTestScript.on('close', () => {
                if (testPassed) {
                    console.log("true");
                    return res.status(201).json({
                        photo,
                        testPassed: true
                    });
                } else {
                    console.log("false");
                    return res.status(500).json({
                        message: 'Test failed',
                        error: err,
                        testPassed: false
                    });
                }
            });
            }
        })
    
        /*photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            } else if(testPassed == false) {
                console.log("false");
                return res.status(500).json({
                    message: 'Test failed',
                    error: err
                });
            } else if(testPassed == true) {
                console.log("true");
                return res.status(201).json(photo);
            }
            //return res.redirect('/photos');
        });*/
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
			photo.path = req.body.path ? req.body.path : photo.path;
			photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
			photo.views = req.body.views ? req.body.views : photo.views;
			photo.likes = req.body.likes ? req.body.likes : photo.likes;
			
            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
};
