var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session =  require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');


//MongoDb and mongoose configuration starts here!
const mongoose = require('mongoose');

const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');
const { Buffer } = require('buffer');


const url = config.mongoUrl;
const connect = mongoose.connect(url,{ useNewUrlParser: true });

connect.then((db)=>{
  console.log('Connected to Server Successfully!!');
},(err)=>{console.log(err);});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));
// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore
// }));

app.use(passport.initialize());
// app.use(passport.session());

//These endpoints are written above authentication as we dont want them to be authenticated!
app.use('/', indexRouter);
app.use('/users', usersRouter);

//Basic Authentication starts here!!
//Basiscally we authenticate before request comes to the middlwware responsible for routing

// function auth(req,res,next){
//   // console.log(req.signedCookies.user);
//   console.log(req.user);
//   if(!req.user){
//         var err = new Error('You are not authenticated!!');
//         err.status = 401;
//         return next(err);

//     //storing only part username and password which is written in base64 then decoding it. 
//   }
//   else{
//           next();
//   }

// }

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/imageUpload',uploadRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
