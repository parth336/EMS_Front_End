var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'CRUD APP' , error:{status:false , message: ""},role:"user"});
});





module.exports = router;
