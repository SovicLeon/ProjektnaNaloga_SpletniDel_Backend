var express = require('express');

var router = express.Router();
var vehicleDataController = require('../controllers/vehicleDataController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/getLastLocation', requiresLogin, vehicleDataController.getLastLocation);
router.get('/getLastDrive', requiresLogin, vehicleDataController.getLastDrive);

router.get('/', vehicleDataController.list);

router.get('/:id', vehicleDataController.show);

router.post('/', requiresLogin, vehicleDataController.create);

router.delete('/:id', requiresLogin, vehicleDataController.remove);

module.exports = router;