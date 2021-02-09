const express = require('express');

const bodyParser = require('body-parser');
var User = require('../models/user');
var passport =  require('passport');
var authenticate = require('../authenticate');

const router = express.Router();
router.use(bodyParser.json());


/* GET users listing. */
router.get('/', authenticate.verifyUser,authenticate.verifyAdmin,function(req, res, next) {
  User.find({})
    .then((users)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err)=>{next(err)})
    .catch((err)=> next(err));
});


//route for sign up
router.post('/signup', (req,res,next) => {
User.register(new User({username: req.body.username}),
 req.body.password, (err,user)=>{
  if(err){
    res.statusCode = 500;
    res.setHeader('Content-Type','application/json');
    res.json({err: err});
  }
  else{
    if(req.body.firstname){
      user.firstname = req.body.firstname;
    }
    if(req.body.lastname){
      user.lastname = req.body.lastname;
    }
    user.save((err,user)=>{
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
        return;
      }
      passport.authenticate('local')(req,res, ()=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({success: true, status: 'Registration Successful'});
      });
    });
  }
});
});



router.post('/login',passport.authenticate('local'),(req, res, next) =>{

  //First we are using local pass port authentication then we are generating token after logging in so that now token will
  //be passed to other requests

  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success: true, token:token, status: 'Successfully Logged in'});
});

router.get('/logout',(req,res)=>{
if(req.session){
  req.session.destroy();
  res.clearCookie('session-id');
  res.redirect('/');
}
else{
  var err = new Error('You are not logged in!!');
  err.status = 403;
  next(err);
}
});

module.exports = router;