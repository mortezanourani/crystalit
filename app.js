var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const injection = require('./middlewares/injectContext');

const session = require('express-session');
const passport = require('passport');

var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var dashboardRouter = require('./routes/dashboard');
var cartRouter = require('./routes/cart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// initialize the context
app.use(function (req, res, next) {
  if (!req.context)
    req.context = {};
  
  next();
});

app.use(injection);

app.use(
  session({
    secret: 'crystal it',
    saveUninitialized: true,
    resave: true,
  })
);

require('./middlewares/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  let messages = req.session.messages || [];
  res.locals.message = messages;
  res.locals.hasMessage = !!messages.length;
  delete req.session.messages;
  next();
});

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/dashboard', dashboardRouter);
app.use('/cart', cartRouter);

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
