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

  async isTaken() {
    const foundAccount = await Context.Account.findOne({
      username: this.username,
    });
    if (foundAccount === null)
      return false;

    return true;
  }

  isPasswordValid() {
    let password = this.passwordHash;
    if (password.length <= 8)
      return false;

    this.passwordHash = hash(password);
    return true;
  }

  async create() {
    return await Context.Account.insertOne(this);
  }

  isPasswordCorrect(password) {
    let passworHash = hash(password);
    let result = this.passwordHash === passworHash;
    return result;
  }
}

module.exports = Account;

