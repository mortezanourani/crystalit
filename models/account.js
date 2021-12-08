const uuid = require('uuid');
const hash = require('md5');

const ACCOUNTS = require('../middlewares/mongoContext').Account;

const Role = {
  Administrator: { name: 'Administrator', title: 'مدیر' },
  Manager: { name: 'Manager', title: 'متصدی' },
  User: { name: 'User', title: 'مشتری' },
};

class Account {
  constructor({ _id, username, password, role, verified }) {
    this._id = _id;
    this.username = username;
    this.passwordHash = password ? hash(password) : undefined;
    this.role = role;
    this.verified = verified;
  }

  async doesExist() {
    let account = await ACCOUNTS.findOne({
      username: this.username,
    });
    return !!account;
  }

  static async findById(accountId) {
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
      role: Role.User.name,
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

  /*
  async updateInformation() {
    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { personalInfo: this.personalInfo } }
    );

    if (!result) return false;
    return true;
  }

  async addAddress(newAddress) {
    let addressId = uuid.v1().split('-').join('');
    newAddress.id = addressId;
    this.addresses.push(newAddress);

    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { addresses: this.addresses } }
    );

    if (!result) return false;
    return true;
  }

  async updateAddress() {
    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { addresses: this.addresses } }
    );

    if (!result) return false;
    return true;
  }
  */
}

module.exports = Account;

