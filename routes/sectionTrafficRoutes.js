var express = require('express');
// Vključimo multer za file upload

var router = express.Router();
var sectionTrafficController = require('../controllers/sectionTrafficController.js');

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

router.get('/', sectionTrafficController.list);

router.get('/:id', sectionTrafficController.show);

router.post('/', requiresLogin, sectionTrafficController.create);

router.delete('/:id', requiresLogin, sectionTrafficController.remove);

module.exports = router;