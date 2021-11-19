const database = require('../config/mongodb');

const Account = database.collection('Account');
const Product = database.collection('Product');
const Category = database.collection('Category');
const Property = database.collection('Property');
const Order = database.collection('Order');

module.exports = {
  Account,
  Product,
  Category,
  Property,
  Order,
};
