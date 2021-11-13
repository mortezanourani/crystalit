var express = require('express');
var router = express.Router();

const Context = require('../models/context');
const Account = require('../models/account');

/* GET Login page. */
router.get('/register', async function (req, res, next) {
  res.render('account/register', { title: 'CrystalIT | Register' });
});

/* POST Login proccess */
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
  res.redirect(url)
});

module.exports = router;
