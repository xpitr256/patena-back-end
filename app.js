var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var linkerLength = require('./routes/linkerLength');
var contact = require('./routes/contact');
var results = require('./routes/results');
var analize = require('./routes/analyze');
var design = require ('./routes/design')
var upload = require("express-fileupload");

var app = express();

let handleCorsHeaders = function (req, res, next) {
  if (req.get("Origin") != null)
  {
    res.header('Access-Control-Allow-Origin', req.get('Origin'));
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.get('Access-Control-Request-Method')) {
      res.header('Access-Control-Allow-Methods', req.get('Access-Control-Request-Method'));
    }
    if (req.get('Access-Control-Request-Headers')) {
      res.header('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers'));
    }
    if (req.method === 'OPTIONS') {
      res.status(200).send();
    } else {
      next()
    }
  } else {
    next()
  }
};


app.use(handleCorsHeaders);

app.use(express.json());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/linkerLength', linkerLength);
app.use('/results', results);
app.use(upload());


app.route("/contact")
    .post(contact.postContact);

app.route("/analyze")
    .post(analize.postAnalyze);

app.route("/design")
    .post(design.postDesign);

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
