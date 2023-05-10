var express = require('express');
// Vključimo multer za file upload

var router = express.Router();
var locationController = require('../controllers/locationController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', locationController.list);

router.get('/:id', locationController.show);

router.post('/', requiresLogin, locationController.create);

router.delete('/:id', requiresLogin, locationController.remove);

module.exports = router;
