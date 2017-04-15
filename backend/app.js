var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require("multer");

var session = require("express-session");
var redisStore = require("connect-redis")(session);

var routerConfig = require("./router");




var upload = multer({
  dest: "upload/"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "recommand 128 bytes random string",
  httpOnly: true,
  store: new redisStore(),
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 1000 * 60
  } 
}));

routerConfig(app);



// var uploadConfig = upload.array('file', 12);

// app.post("/upload/",
//         uploadConfig,
//         function (req, res){
//           console.log(req.files);
//           console.log("length: ",req.files.length);
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
