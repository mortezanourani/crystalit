const uuid = require('uuid');
const ACCOUNTS = require('../middlewares/mongoContext').Account;

class Address {
  constructor({ _id, address, street, city, province, postalCode }) {
    this._id = _id;
    this.address = address;
    this.street = street;
    this.city = city;
    this.province = province;
    this.postalCode = postalCode;
  }

  static async findByUserId(userId) {
    if (!userId) userId = this._context.userId;
    let account = await ACCOUNTS.findOne({ _id: userId });
    if (!account.addresses) return [];
    return account.addresses;
  }

  static async findById(addressId) {
    const userId = this._context.userId;
    const account = await ACCOUNTS.findOne({ _id: userId });
    let address;
    for (let accountAddress of account.addresses) {
      if (accountAddress._id !== addressId)
        continue;
      address = accountAddress;
      break;
    }
    return new Address(address);
  }

  async save() {
    let userId = this._context.userId;
    let account = await ACCOUNTS.findOne({ _id: userId });
    let addresses = account.addresses || [];
    addresses.push({
      _id: uuid.v1()
        .split('-')
        .join(''),
      address: this.address,
      street: this.street,
      city: this.city,
      province: this.province,
      postalCode: this.postalCode,
    });
    let result = await ACCOUNTS.updateOne(
      { _id: userId },
      { $set: { addresses: addresses } }
    );
    return result.acknowledged;
  }

  async update() {
    let userId = this._context.userId;
    const account = await ACCOUNTS.findOne({ _id: userId });
    let addresses = [...account.addresses];
    for (let index in addresses) {
      if (addresses[index]._id !== this._id)
        continue;
      addresses[index] = {
        _id: this._id,
        address: this.address,
        street: this.street,
        city: this.city,
        province: this.province,
        postalCode: this.postalCode,
      };
      break;
    }
    let result = await ACCOUNTS.updateOne(
      { _id: userId },
      { $set: { addresses: addresses } }
    );
    return result.acknowledged;
  }
  
  async delete() {
    let userId = this._context.userId;
    const account = await ACCOUNTS.findOne({ _id: userId });
    let addresses = [];
    for (let address of account.addresses) {
      if (address._id === this._id)
        continue;
      addresses.push(address);
    }
    let result = await ACCOUNTS.updateOne(
      { _id: userId },
      { $set: { addresses: addresses } }
    );
    return result.acknowledged;
  }
}

module.exports = Address;
