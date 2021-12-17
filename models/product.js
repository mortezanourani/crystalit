const PRODUCTS = require('../middlewares/mongoContext').Product;
const uuid = require('uuid');

class Product {
  constructor({ _id, title, categories, properties, images, count, price, discount }) {
    this._id = _id;
    this.title = title;
    this.categories = categories;
    this.properties = properties;
    this.images = images;
    this.count = count;
    this.price = price;
    this.discount = discount;
  }

  static async find() {
    let products = await PRODUCTS.find({}).toArray();
    return products;
  }

  static async findByCategory(categoryName) {
    let { Category } = this._context.models;
    let currentCategory = await Category.findByName(categoryName);
    
    let products = await PRODUCTS.find({
      categories: {
        $in: [{
          name: currentCategory.name,
          title: currentCategory.title
        }]
      }
    }).toArray();
    return products;
  }

  static async findById(productId) {
    let product = await PRODUCTS.findOne({
      _id: productId
    });
    return new Product(product);
  }

  async save() {
    for (let index in this.categories)
      delete this.categories[index]._id;
    
    for (let index in this.properties)
      delete this.properties[index]._id;
    
    let product = {
      _id: uuid.v1()
      .split('-')
        .join(''),
      title: this.title,
      categories: this.categories,
      properties: this.properties,
      images: this.images,
      count: this.count,
      price: this.price,
      discount: this.discount
    };
    let result = await PRODUCTS.insertOne(product);
    return result.acknowledged;
  }

  async update() {
    for (let index in this.categories)
      delete this.categories[index]._id;

    for (let index in this.properties)
      delete this.properties[index]._id;

    let set = {
      title: this.title,
      categories: this.categories,
      properties: this.properties,
      images: this.images,
      count: this.count,
      price: this.price,
      discount: this.discount,
    };
    let result = await PRODUCTS.updateOne(
      { _id: this._id, },
      { $set: set }
    );
    return result.acknowledged;
  }

  async delete() {
    let result = await PRODUCTS.deleteOne({ _id: this._id });
    return result.acknowledged;
  }
}

module.exports = Product;
