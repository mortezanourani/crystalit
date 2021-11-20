const express = require('express');
const passport = require('passport');
var router = express.Router();

const Account = require('../models/account');

/* GET Account page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated())
    return res.redirect('/dashboard/');
  
  res.redirect('/account/login/');
});

/* GET Register page. */
router.get('/register', function (req, res, next) {
  if (req.isAuthenticated())
    return res.redirect('/dashboard/');
  
  let message = res.locals.message;
  res.render('account/register', {
    title: 'CrystalIT | Register',
    errorMessage: message,
  });
});

/* POST Register proccess */
router.post(
  '/register',
  passport.authenticate('register', {
    failureMessage: true,
    failureRedirect: '/account/register/',
    successRedirect: '/',
  })
);

/* GET Login page. */
router.get('/login', function (req, res, next) {
  if (req.isAuthenticated())
    return res.redirect('/dashboard/');
  
  let message = res.locals.message;
  res.render('account/login', {
    title: 'CrystalIT | Login',
    errorMessage: message,
  });
});

/* POST Login page. */
router.post(
  '/login',
  passport.authenticate('login', {
    failureMessage: true,
    failureRedirect: '/account/login/',
    successRedirect: '/',
  })
);

/* GET Changepassword page */
router.get('/changepassword', function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let message = res.locals.message;
  res.render('account/changepassword', {
    title: 'CrystaIT | Change Password',
    errorMessage: message,
  });
});

/* POST Changepassword page */
router.post('/changepassword', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let account = new Account();
  let formCollection = req.body;
  let currentPassword = formCollection.password;
  let newPassword = formCollection.newPassword;
  Object.assign(account, req.user);

  let errorMessage = '';
  if (!account.isPasswordCorrect(currentPassword))
    errorMessage = 'Current password is not correct.';
  
  if (!account.isPasswordValid(newPassword))
    errorMessage = 'The new password is not strong enaugh.';

  let acknowledged = await account.changePassword(newPassword);
  if (!acknowledged)
    errorMessage = 'Something went wrong.';
  
  if(errorMessage === '')
    errorMessage = 'Passwrord changed successfully.';
  
  req.session.messages = [errorMessage];
  res.redirect('/account/changepassword/');
})

module.exports = router;
