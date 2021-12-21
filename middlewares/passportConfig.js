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
      return done(null, false, { message: 'شما یک حساب کاربری دارید.' });

    let isPasswordValid = Account.isPasswordValid(password);
    if (!isPasswordValid)
      return done(null, false, { message: 'رمزعبور وارد شده معتبر نیست.' });

    const account = new Account({ username, password });
    let saveResult = await account.save();
    if (!saveResult)
      return done(null, false, { message: 'خطایی رخ داده است. لطفا مجددا تلاش نمایید.' });
    return done(null, account);
  })
);

passport.use(
  'login',
  new LocalStrategy(async (username, password, done) => {
    const account = await Account.findOne({ username, password });
    if (!account)
      return done(null, false, {
        message: 'نام کاربری یا رمزعبور صحبح نیست.',
      });
    return done(null, account);
  })
);
