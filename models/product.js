const Category = require('./category');
const Property = require('./property');

class Product {
  title = new String();
  categories = new Array(new Category());
  properties = new Array(new Property());
  count = new Number();
  Price = new Number();
  discount = new Number();
}

module.exports = Product;
