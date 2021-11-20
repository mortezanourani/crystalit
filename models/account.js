const uuid = require('uuid');
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

    let accountId = uuid.v1()
      .split('-')
      .join('');
    this._id = accountId;

    let result = await Context.Account.insertOne(this);
    return result.acknowledged;
  }

  async findByUsername(username) {
    let account = await Context.Account.findOne({
      username: username,
    });
    if (!account)
      return false;

    Object.assign(this, account);
    return true;
  }

  isPasswordCorrect(password) {
    let hashedPassword = hash(password);
    return (this.passwordHash === hashedPassword);
  }

  async changePassword(newPassword) {
    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { passwordHash: hash(newPassword) } }
    );

    if (!result)
      return false;
    return true;
  }

  async updateInformation(account) {
    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { personalInfo: account.personalInfo } }
    );

    if (!result)
      return false;
    return true;
  }
}

module.exports = Account;

