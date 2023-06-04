var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
const path = require ('path');
const fs = require('fs');
//var upload = multer({dest: 'public/images/'});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const userIdFolder = path.join('public/images', req.session.userId);
      fs.mkdirSync(userIdFolder, { recursive: true });
      cb(null, userIdFolder);
    },
    filename: function (req, file, cb) {
      const files = fs.readdirSync(path.join('public/images', req.session.userId));
      const index = (files.length + 1);
      const originalExtension = path.extname(file.originalname);
      const filename = path.basename(file.originalname, originalExtension);
      cb(null, `${filename}-${index}${originalExtension}`);
      cb(null, `${filename}2-${index}${originalExtension}`);
    }
  });
  
  const upload = multer({ storage: storage });

var router = express.Router();
var photoController = require('../controllers/photoController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', photoController.list);
//router.get('/publish', requiresLogin, photoController.publish);
router.get('/:id', photoController.show);

router.post('/', requiresLogin, upload.single('image'), photoController.create);

router.put('/:id', photoController.update);

router.delete('/:id', photoController.remove);

module.exports = router;