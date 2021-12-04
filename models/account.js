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
    this.username = username;
    this.passwordHash = hash(password);
    this.role = Role.User.name;
    this.verified = false;
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
    let result = await ACCOUNTS.insertOne(this);
    return result.acknowledged;
  }

  async findByUsername(username) {
    let account = await Context.Account.findOne({
      username: username,
    });
    if (!account) return false;

    Object.assign(this, account);
    return true;
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

