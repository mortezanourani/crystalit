const express = require('express');
const passport = require('passport');
var router = express.Router();

const Account = require('../models/account');

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
  .route(['/changepassword', '/information'])
  .all((req, res, next) => {
    if (!req.isAuthenticated())
      return res.redirect('/account/login/')
    next();
  });

/* ROUTE Changepassword page */
router
  .route('/changepassword')
  .get((req, res) => {
    let message = res.locals.message;
    res.render('account/changepassword', {
      title: 'CrystaIT | Change Password',
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

module.exports = router;
