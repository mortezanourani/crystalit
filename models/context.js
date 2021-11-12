const { MongoClient } = require('mongodb');

const connectionString = 'mongodb://localhost:27017/';
const databaseName = 'crystalit';
let database;

const client = new MongoClient(connectionString);
try {
  client.connect();
  database = client.db(databaseName);
} catch (error) {
  console.log(error);
  throw error;
}

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
