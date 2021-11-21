const express = require('express');
const passport = require('passport');
var router = express.Router();

const Account = require('../models/account');
const Address = require('../models/address');

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

/* GET Information page */
router.get('/information', function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let account = req.user;
  let information = account.personalInfo;
  let message = res.locals.message;

  res.render('account/information', {
    title: 'CrystaIT | Information',
    firstName: information.firstName,
    lastName: information.lastName,
    birthDate: information.birthDate,
    phoneNumbers: information.phoneNumbers,
    errorMessage: message,
  });
});

/* POST Information page */
router.post('/information', async function (req, res, next) {
  let account = new Account();
  Object.assign(account, req.user);
  let formCollection = req.body;
  account.personalInfo.firstName = formCollection.firstname;
  account.personalInfo.lastName = formCollection.lastname;
  account.personalInfo.birthDate = formCollection.birthdate;
  account.personalInfo.phoneNumbers = new Array(0);
  if (formCollection.phonenumber) {
    if (typeof formCollection.phonenumber === 'object') {
      formCollection.phonenumber.forEach((phoneNumber) => {
        if(phoneNumber)
          account.personalInfo.phoneNumbers.push(phoneNumber);
      });
    } else {
      if(formCollection.phonenumber)
        account.personalInfo.phoneNumbers.push(formCollection.phonenumber);
    }
  }
  if (formCollection.newPhonenumber)
    account.personalInfo.phoneNumbers.push(formCollection.newPhonenumber);
  
  let errorMessage = '';
  let acknowledged = await account.updateInformation();
  if (!acknowledged)
    errorMessage = 'Something went wrong.';

  if (errorMessage === '')
    errorMessage = 'Personal information updated successfully.';
  
  req.session.messages = [errorMessage];
  res.redirect('/account/information/');
});

/* GET Address page */
router.get('/address', function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');

  let account = req.user;
  let addresses = account.addresses;
  let message = res.locals.message;
  
  res.render('account/address', {
    title: 'CrystaIT | Address',
    addresses: addresses,
    errorMessage: message,
  });
});

/* GET Address add page */
router.get('/address/add', function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  res.render('account/addressAdd.pug', {
    title: 'Crystal IT | Add Address',
  })
});

/* POST Address add page */
router.post('/address/add', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let account = new Account();
  Object.assign(account, req.user);
  let address = new Address();
  Object.assign(address, req.body);

  let acknowledged = await account.addAddress(address);
  if (!acknowledged)
    errorMessage = 'Something went wrong.';
  errorMessage = 'Address added successfully.';

  res.redirect('/account/address/');
});

/* GET Address edit page */
router.get('/address/:id', function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let account = req.user;
  let address = new Address();
  for (accountAddress of account.addresses) {
    if (accountAddress.id != req.params.id)
      continue;
    address = accountAddress;
  }
  
  res.render('account/addressUpdate', {
    title: 'Crystal IT | Edit Address',
    address: address,
  })
})

/* POST Address edit page */
router.post('/address/:id', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let account = new Account();
  Object.assign(account, req.user);
  let address = new Address();
  address.id = req.params.id;
  Object.assign(address, req.body);
  let addresses = new Array(0);
  for (accountAddress of account.addresses) {
    if (accountAddress.id != address.id) {
      addresses.push(accountAddress);
      continue;
    }
    addresses.push(address);
  }
  account.addresses = addresses;
  
  let acknowledged = await account.updateAddress();
  if (!acknowledged)
    errorMessage = 'Something went wrong.';
  errorMessage = 'Address updated successfully.';

  res.redirect('/account/address/');
});

/* Address remove */
router.get('/address/remove/:id', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let account = new Account();
  Object.assign(account, req.user);
  let addressId = req.params.id;
  let addresses = new Array(0);
  for (accountAddress of account.addresses) {
    if (accountAddress.id === addressId)
      continue;
    addresses.push(accountAddress);
  }
  account.addresses = addresses;

  let acknowledged = await account.updateAddress();
  if (!acknowledged)
    errorMessage = 'Something went wrong.';
  errorMessage = 'Address updated successfully.';

  res.redirect('/account/address/');
});

/* Account Logout */
router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
