class Item {
  productId = new String();
  title = new String();
  price = new Number();
  discount = new Number();

  constructor(product) {
    this.productId = product._id;
    this.title = product.title;
    this.price = product.price;
    this.discount = product.discount;
  }
}

module.exports = Item;