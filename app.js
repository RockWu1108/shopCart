if(process.env.NODE_ENV !=='production'){
  require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL , {
  useNewUrlParser : true
});
var db = mongoose.connection
db.on('error' , error => console.error(error));
db.once('open' , () => console.error('success'));


var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();
var bodyParser = require('body-parser');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/' ,indexRouter);
app.use('/api/auth', authRouter);
app.use(bodyParser.urlencoded({limit : '50mb' , extended: false}));

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
});

app.listen(3000);

module.exports = app;
