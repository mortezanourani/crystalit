const Address = require('./address');
const Account = require('./account');
const Item = require('./item');

const ORDERS = require('../middlewares/mongoContext').Order;

const Status = {
  Submitted: { step: 1, title: 'در انتظار پرداخت', date: new Date() },
  Paid: { step: 2, title: 'پرداخت شده', date: new Date() },
  Preparing: { step: 3, title: 'در حال آماده سازی سفارش', date: new Date() },
  Sent: { step: 4, title: 'ارسال شده', date: new Date() },
  Done: { step: 5, title: 'تحویل شده', date: new Date() },
};

const uuid = require('uuid');

class Order {
  constructor({ _id, accountId, customer, address, phoneNumber, items, discount, status }) {
    this._id = _id;
    this.accountId = accountId || this._context.userId;
    this.customer = customer || '';
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.items = items;
    this.discount = discount;
    let emptyStatus = [];
    emptyStatus.push(Status.Submitted);
    this.status = status || emptyStatus;
  }
  
  static async findAll(userId) {
    if (!userId)
      userId = this._context.userId;
    let result = await ORDERS.find({
      accountId: userId,
    }).toArray();
    console.log('oka?');
    return result;
  }

  static async findById(orderId) {
    let result = await ORDERS.findOne({
      _id: orderId,
    });
    if (!result)
      return null;
    return new Order(result);
  }

  async save() {
    let orderId = uuid.v1()
      .split('-')
      .join('');
    this._id = orderId;

    let account = await Account.findById(this.accountId);
    let result = await ORDERS.insertOne({
      _id: this._id,
      accountId: account._id,
      customer: `${account.personalInfo.firstName} ${account.personalInfo.lastName}`,
      address: this.address,
      phoneNumber: this.phoneNumber,
      items: this.items,
      discount: this.discount,
      status: this.status,
    });
    return result;
  }
}

module.exports = Order;