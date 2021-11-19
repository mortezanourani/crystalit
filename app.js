var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'crystal it',
    saveUninitialized: true,
    resave: true,
  })
);
app.use(function (req, res, next) {
  let messages = req.session.messages || [];
  res.locals.message = messages;
  res.locals.hasMessage = !!messages.length;
  delete req.session.messages;
  next();
});
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use('/', indexRouter);
app.use('/account', accountRouter);

const Context = require('./models/context');
const Account = require('./models/account');
const md5 = require('md5');

passport.use(
  'register',
  new LocalStrategy(async function (username, password, done) {
    let account = new Account();
    let alreadyExists = await account.alreadyExists(username);
    if (alreadyExists)
      return done(null, false, { message: 'Username already exists.' });

    let isPasswordValid = account.isPasswordValid(password);
    if (!isPasswordValid)
      return done(null, false, { message: 'Entered password is not valid.' });

    let isCreated = await account.create(username, password);
    if (!isCreated)
      return done(null, false, { message: 'Something went wrong.' });
    
    return done(null, account);
  })
);

passport.use(
  'login',
  new LocalStrategy(function (username, password, done) {
    Context.Account.findOne(
      {
        username: username,
        passwordHash: md5(password),
      },
      function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username.' });
        return done(null, user);
      }
    );
  })
);

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
