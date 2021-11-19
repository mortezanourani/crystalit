const express = require('express');
const passport = require('passport');
var router = express.Router();

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

module.exports = router;
