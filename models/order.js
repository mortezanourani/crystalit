const Address = require('./account.address');
const Item = require('./item');
const { Status, OrderStatus } = require('./status');

class Order {
  accountId = new String();
  address = new Address();
  phoneNumber = new Number();
  items = new Array(new Item());
  discount = new Number();
  status = new Array(new Status());
}

module.exports = Order;