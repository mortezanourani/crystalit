const hash = require('md5');
const Context = require('./context');
const AccountRole = require('./role');
const Information = require('./information')
const Address = require('./address');

class Account {
  username = new String();
  passwordHash = new String();
  role = new String();
  personalInfo = new Information();
  addresses = new Array(new Address());
  verified = new Boolean(false);

  constructor() {
    this.username = '';
    this.passwordHash = '';
    this.role = AccountRole.User.name;
    this.addresses = new Array(0);
    this.verified = false;
  }

  async alreadyExists(username) {
    let account = await Context.Account.findOne({
      username: username,
    });
    return !!account;
  }

  isPasswordValid(password) {
    return password.length >= 8;
  }

  async create(username, password) {
    this.username = username;
    this.passwordHash = hash(password);

    let result = await Context.Account.insertOne(this);
    return result.acknowledged;
  }

  #isPasswordCorrect(password) {
    let passworHash = hash(password);
    let result = this.passwordHash === passworHash;
    return result;
  }
}

module.exports = Account;

