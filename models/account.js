const uuid = require('uuid');
const hash = require('md5');

const ACCOUNTS = require('../middlewares/mongoContext').Account;
const { Timestamp } = require('bson');

const Role = {
  Administrator: { name: 'Administrator', title: 'مدیر' },
  Manager: { name: 'Manager', title: 'متصدی' },
  User: { name: 'User', title: 'مشتری' },
};

class Account {
  constructor({ _id, username, password, role, verified }) {
    this.username = username;
    this.passwordHash = hash(password);
    this.role = role;
    this.verified = verified;
  }

  async doesExist() {
    let account = await ACCOUNTS.findOne({
      username: this.username,
    });
    return !!account;
  }

  static isPasswordValid(password) {
    return password.length >= 8;
  }

  async save() {
    this._id = uuid.v1()
      .split('-')
      .join('');
    this.role = Role.User.name;
    this.verified = false;
    let result = await ACCOUNTS.insertOne(this);
    return result.acknowledged;
  }

  static async findById(accountId) {
    let account = await ACCOUNTS.findOne({
      _id: accountId,
    });
    return account;
  }

  static async findByUsername(username) {
    let account = await ACCOUNTS.findOne({
      username: username,
    });
    return account;
  }

  static async find({ username, password }) {
    let account = await ACCOUNTS.findOne({
      username: username,
      passwordHash: hash(password),
    });
    return account;
  }

  isPasswordCorrect(password) {
    let hashedPassword = hash(password);
    return this.passwordHash === hashedPassword;
  }

  async changePassword(newPassword) {
    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { passwordHash: hash(newPassword) } }
    );

    if (!result) return false;
    return true;
  }

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
}

module.exports = Account;

