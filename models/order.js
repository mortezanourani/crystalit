const Address = require('./address');
const Item = require('./item');

const Status = {
  Submitted: { step: 1, title: 'در انتظار پرداخت' },
  Paid: { step: 2, title: 'پرداخت شده' },
  Preparing: { step: 3, title: 'در حال آماده سازی سفارش' },
  Sent: { step: 4, title: 'ارسال شده' },
  Done: { step: 5, title: 'تحویل شده' },
};

const uuid = require('uuid');

class Order {
  accountId = new String();
  address = new Address();
  phoneNumber = new Number();
  items = new Array(0);
  discount = new Number();
  status = new Array(0);

  async findAll(userId) {
    let result;
    if (!userId)
      result = await Context.Order.find({}).toArray();
    else
      result = await Context.Order.find({
        accountId: userId,
      }).toArray();
    
    console.log(result);
    return result;
  }

  async save() {
    let orderId = uuid.v1()
      .split('-')
      .join('');
    this._id = orderId;

    let result = await Context.Order.insertOne(this);
    return result.acknowledged;
  }
}

module.exports = Order;