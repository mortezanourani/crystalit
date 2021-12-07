const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Account = require('../models/account');

passport.serializeUser((user, done) => {
  let userId = user._id;
  done(null, userId);
});

passport.deserializeUser(async (userId, done) => {
  let user = await Account.findById(userId);
  done(null, user);
});

passport.use(
  'register',
  new LocalStrategy(async (username, password, done) => {
    let doesExist = !! await Account.findByUsername(username);
    if (doesExist)
      return done(null, false, { message: 'Username already exists.' });

    let isPasswordValid = Account.isPasswordValid(password);
    if (!isPasswordValid)
      return done(null, false, { message: 'Entered password is not valid.' });

    const account = new Account({ username, password });
    let saveResult = await account.save();
    if (!saveResult)
      return done(null, false, { message: 'Something went wrong.' });
    return done(null, account);
  })
);

passport.use(
  'login',
  new LocalStrategy(async (username, password, done) => {
    const account = await Account.findOne({ username, password });
    if (!account)
      return done(null, false, {
        message: 'Username/Password is wrong.',
      });
    return done(null, account);
  })
);
