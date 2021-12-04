const PRODUCTS = require('../middlewares/mongoContext').Product;
const uuid = require('uuid');

class Product {
  title = new String();
  categories = new Array(new Category());
  properties = new Array(new Property());
  images = new Array(new String());
  count = new Number();
  price = new Number();
  discount = new Number();

  constructor({title, categories, properties, images, count, price, discount}) {
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
    return product;
  }

  async save() {
    let productId = uuid.v1()
      .split('-')
      .join('');
    this._id = productId;
    let result = await Context.Product.insertOne(this);
    if (!result)
      return false;
    return true;
  }

  async update() {
    let set = {
      title: this.title,
      categories: this.categories,
      properties: this.properties,
      images: this.images,
      count: this.count,
      price: this.price,
      discount: this.discount,
    };

    if (!set.categories)
      set.categories = new Array(0);
    
    if (!set.properties)
      set.properties = new Array(0);
    
    if (!set.images)
      set.images = new Array(0);
    
    let result = await Context.Product.updateOne(
      { _id: this._id },
      { $set: set }
    );

    if (!result)
      return false;
    return true;
  }

  async delete() {
    let result = await Context.Product.remove({ _id: this._id });
    return result.acknowledged;
  }
}

module.exports = Product;
