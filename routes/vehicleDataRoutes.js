var express = require('express');

var router = express.Router();
var vehicleDataController = require('../controllers/vehicleDataController.js');

function requiresLogin(req, res, next){
    if(req.body && req.body.sessionID){
        // If the sessionID exists in the request body, set it as a property of the request object
        req.sessionID = req.body.sessionID;
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', vehicleDataController.list);

router.get('/:id', vehicleDataController.show);

router.post('/', requiresLogin, vehicleDataController.create);

router.delete('/:id', requiresLogin, vehicleDataController.remove);

module.exports = router;