const express = require('express');
const passport = require('passport');
var router = express.Router();

const Account = require('../models/account');
const Information = require('../models/information');
const Address = require('../models/address');

router
  .route(['/', '/register', '/login'])
  .all((req, res, next) => {
    if (req.isAuthenticated())
      return res.redirect('/dashboard/');
    next();
  });

/* GET Account page. */
router
  .get('/', (req, res) => {
    if (req.isAuthenticated())
      return res.redirect('/dashboard/');
    res.redirect('/account/login/');
  });

/* ROUTE Register page. */
router
  .route('/register')
  .get((req, res) => {
    let message = res.locals.message;
    res.render('account/register', {
      title: 'CrystalIT | Register',
      errorMessage: message,
    });
  })
  .post(
    passport.authenticate('register', {
      session: false,
      failureMessage: true,
      failureRedirect: '/account/register/',
      successRedirect: '/account/login/',
    })
  );

/* ROUTE Login page. */
router
  .route('/login')
  .get((req, res) => {
    let message = res.locals.message;
    res.render('account/login', {
      title: 'CrystalIT | Login',
      errorMessage: message,
    });
  })
  .post(
    passport.authenticate('login', {
      session: true,
      failureMessage: true,
      failureRedirect: '/account/login/',
      successRedirect: '/dashboard/',
    })
  );

/* Account Logout */
router.get('/logout',
  (req, res) => {
    req.logout();
    res.redirect('/');
  });



/* [Authenticated]
** -------------------------------------------------- */
router
  .route([
    '/changepassword',
    '/information',
    '/address',
    '/address/add',
    '/address/:id',
  ])
  .all((req, res, next) => {
    if (!req.isAuthenticated())
      return res.redirect('/account/login/');
    next();
  });

/* ROUTE Changepassword page */
router
  .route('/changepassword')
  .get((req, res) => {
    let message = res.locals.message;
    res.render('account/changepassword', {
      title: 'CrystaIT | Change Password',
      role: req.context.user.role,
      errorMessage: message,
    });
  })
  .post(async (req, res) => {
    let username = req.context.user.username;
    let password = req.body.password;
    let account = await Account.findOne({ username, password });
    if (!account) {
      // Return the wrong password error.
      return res.redirect('/account/changepassword/');
    }

    let newPassword = req.body.newPassword;
    if (!Account.isPasswordValid(newPassword)) {
      // Return the invalid password error.
      return res.redirect('/account/changepassword/');
    }
    
    let acknowledged = account.changePassword(newPassword);
    if (!acknowledged) {
      // Return the faild operation error.
      return res.redirect('/account/changepassword/');
    }

    let errorMessage = 'Passwrord changed successfully.';
    
    req.session.messages = [errorMessage];
    res.redirect('/account/changepassword/');
  });

/* ROUTE Information page */
router
  .route('/information')
  .get(async (req, res) => {
    let information = await Information.findByUserId();
    let message = res.locals.message;
    res.render('account/information', {
      title: 'CrystaIT | Information',
      information: information,
      errorMessage: message,
    });
  })
  .post(async (req, res) => {
    let errorMessage;
    const information = new Information(req.body);
    let acknowledged = await information.update();
    if (!acknowledged)
      errorMessage = 'Something went wrong.';
    if (errorMessage === '')
      errorMessage = 'Personal information updated successfully.';
  
    req.session.messages = [errorMessage];
    res.redirect('/account/information/');
  });

/* ROUTE Address page */
router.get('/address', async (req, res) => {
  let addresses = await Address.findByUserId();
  let message = res.locals.message;
  res.render('account/address', {
    title: 'CrystaIT | Address',
    addresses: addresses,
    errorMessage: message,
  });
});

/* ROUTE Address add page */
router
  .route('/address/add')
  .get((req, res) => {
    res.render('account/address.add.pug', {
      title: 'Crystal IT | Add Address',
    })
  })
  .post(async (req, res) => {
    const address = new Address(req.body);
    let acknowledged = await address.save();
    if (!acknowledged)
      errorMessage = 'Something went wrong.';
    errorMessage = 'Address added successfully.';
    req.session.messages = [errorMessage];
    res.redirect('/account/address/');
  });

/* ROUTE specific Address page */
router
  .route('/address/:id')
  .get(async (req, res) => {
    const addressId = req.params.id;
    let address = await Address.findById(addressId);
    res.render('account/address.edit.pug', {
      title: 'Crystal IT | Edit Address',
      address: address,
    })
  })
  .post(async (req, res) => {
    let address = new Address(req.body);
    address._id = req.params.id;
    let acknowledged = await address.update();
    if (!acknowledged)
      errorMessage = 'Something went wrong.';
    errorMessage = 'Address updated successfully.';
    req.session.messages = [errorMessage];
    res.redirect('/account/address/');
  });

/* Address remove */
router.get('/address/remove/:id', async (req, res) => {
  let addressId = req.params.id;
  const address = await Address.findById(addressId);
  let acknowledged = await address.delete();
  if (!acknowledged)
    errorMessage = 'Something went wrong.';
  errorMessage = 'Address removed successfully.';
  req.session.messages = [errorMessage];
  res.redirect('/account/address/');
});

module.exports = router;
