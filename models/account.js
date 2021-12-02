const uuid = require('uuid');
const hash = require('md5');
const Information = require('./information')
const Address = require('./address');

const Role = {
  Administrator: { name: 'Administrator', title: 'مدیر' },
  Manager: { name: 'Manager', title: 'متصدی' },
  User: { name: 'User', title: 'مشتری' },
};

class Account {
  username = new String();
  passwordHash = new String();
  role = new Object();
  personalInfo = new Information();
  addresses = new Array(new Address());
  verified = new Boolean(false);

  constructor() {
    this.username = '';
    this.passwordHash = '';
    this.role = Role.User;
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
    return this.passwordHash === hashedPassword;
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

  async updateInformation() {
    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { personalInfo: this.personalInfo } }
    );

    if (!result)
      return false;
    return true;
  }

  async addAddress(newAddress) {
    let addressId = uuid.v1()
      .split('-')
      .join('');
    newAddress.id = addressId;
    this.addresses.push(newAddress);

    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { addresses: this.addresses } }
    );

    if (!result)
      return false;
    return true;
  }

  async updateAddress() {
    let result = await Context.Account.updateOne(
      { _id: this._id },
      { $set: { addresses: this.addresses } }
    );

    if (!result)
      return false;
    return true;
  }
}

module.exports = () => Account;

