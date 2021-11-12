class Product {
  title = new String();
  categories = new Array(new Category());
  properties = new Array(new Property());
  count = new Number();
  Price = new Number();
  discount = new Number();
}

class Category {
  name = new String();
  title = new String();
}

class Property {
  name = new String();
  title = new String();
  unit = new String();
}

module.exports = {
  Product,
  Category,
  Property,
};
