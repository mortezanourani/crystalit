const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Account = require('../models/account');
const Context = require('../models/context');
const hash = require('md5');

passport.serializeUser(function (user, done) {
  let userId = user._id;
  done(null, userId);
});

passport.deserializeUser(function (userId, done) {
  Context.Account.findOne({ _id: userId }, function (err, user) {
    done(null, user);
  });
});

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
  new LocalStrategy(async function (username, password, done) {
    let account = new Account();
    let acknowledged = await account.findByUsername(username);
    if (!acknowledged)
      return done(null, false, {
        message: 'There is no account with this username.',
      });

    let isPasswordCorrect = account.isPasswordCorrect(password);
    if (!isPasswordCorrect)
      return done(null, false, {
        message: 'Username and Password is not matched.',
      });

    return done(null, account);
  })
);