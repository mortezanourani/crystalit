var express = require('express');
var router = express.Router();

const Context = require('../models/context');
const Account = require('../models/account');
const passport = require('passport');

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
  res.render('account/register', { title: 'CrystalIT | Register', errorMessage: message });
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
  
  res.render('account/login', {
    title: 'CrystalIT | Login',
  });
});

/* POST Login page. */
router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/account/login/' }),
  function (req, res, next) {
    res.redirect('/dashboard/');
  }
);

module.exports = router;
