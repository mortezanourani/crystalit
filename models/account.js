const uuid = require('uuid');
const hash = require('md5');

const ACCOUNTS = require('../middlewares/mongoContext').Account;

const Role = {
  Administrator: { name: 'Administrator', title: 'مدیر', level: 1 },
  Manager: { name: 'Manager', title: 'متصدی', level: 2 },
  User: { name: 'User', title: 'مشتری', level: 3 },
};

class Account {
  constructor({ _id, username, password, role, verified, addresses, personalInfo }) {
    this._id = _id;
    this.username = username;
    this.passwordHash = password ? hash(password) : undefined;
    this.role = role;
    this.verified = verified;
    if (addresses)
      this.addresses = addresses;
    if (personalInfo)
      this.personalInfo = personalInfo;
  }

  async doesExist() {
    let account = await ACCOUNTS.findOne({
      username: this.username,
    });
    return !!account;
  }

  static async findById(accountId) {
    if (!accountId)
      accountId = this._context.userId;
    let account = await ACCOUNTS.findOne({
      _id: accountId,
    });
    if (!account)
      return null;
    return new Account(account);
  }

  static async findByUsername(username) {
    let account = await ACCOUNTS.findOne({
      username: username,
    });
    if (!account)
      return null;
    return new Account(account);
  }

  static async findOne({ username, password }) {
    let account = await ACCOUNTS.findOne({
      username: username,
      passwordHash: hash(password),
    });
    if (!account)
      return null;
    return new Account(account);
  }

  static isPasswordValid(password) {
    return password.length >= 8;
  }

  async save() {
    let account = {
      _id: uuid.v1()
        .split('-')
        .join(''),
      username: this.username,
      passwordHash: this.passwordHash,
      role: Role.User,
      verified: false,
    };
    let result = await ACCOUNTS.insertOne(account);
    return result.acknowledged;
  }

  async changePassword(newPassword) {
    let result = await ACCOUNTS.updateOne(
      { _id: this._id },
      { $set: { passwordHash: hash(newPassword) } }
    );
    return result.acknowledged;
  }
}

module.exports = Account;

