var express = require('express');
var router = express.Router();

const Context = require('../models/context');
const Account = require('../models/account');

/* GET Register page. */
router.get('/register', function (req, res, next) {
  res.render('account/register', { title: 'CrystalIT | Register' });
});

/* POST Register proccess */
router.post('/register', async function (req, res, next) {
  let account = new Account();
  account.username = req.body.username;
  account.passwordHash = req.body.password;

  if (await account.isTaken())
    return res.send('یک حساب کاربری با این نام کاربری موجود است.');

  if (!account.isPasswordValid())
    return res.send('رمزعبور وارد شده نامناسب است.');

  account.create();

  let url = '/account/login/';
  res.redirect(url);
});

/* GET Login page. */
router.get('/login', function (req, res, next) {
  let session = req.session;
  let errorMessage = session.message;
  res.render('account/login', {
    title: 'CrystalIT | Login',
    message: errorMessage,
  });
});

/* POST Login page. */
router.post('/login', async function (req, res, next) {
  let session = req.session;

  let username = req.body.username;
  let password = req.body.password;

  let account = new Account();
  Object.assign(account, await Context.Account.findOne({ username: username }));
  
  if (account._id === undefined || !account.isPasswordCorrect(password)) {
    let errorMessage = 'نام کاربری یا رمز عبور نادرست می باشد.';
    res.render('account/login', {
      title: 'CrystalIT | Login',
      message: errorMessage,
    });
  } else {
    delete account.passwordHash;
    session.Account = account;
    res.redirect('/dashboard/');
  }
});

module.exports = router;
