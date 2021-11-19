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

module.exports = database;