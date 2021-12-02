const uuid = require('uuid');
const Category = require('./category');
const Property = require('./property');

class Product {
  title = new String();
  categories = new Array(new Category());
  properties = new Array(new Property());
  images = new Array(new String());
  count = new Number();
  price = new Number();
  discount = new Number();

  constructor() {
    this.title = '';
    this.categories = new Array(0);
    this.properties = new Array(0);
    this.images = new Array('');
    this.count = 0;
    this.price = 0;
    this.discount = 0;
  }

  static async findAll() {
    let products = await Context.Product.find({}).toArray();
    return products;
  }

  async findSome(category) {
    let currentCategory = new Category();
    currentCategory = await Context.Category.findOne({
      name: category
    });
    delete currentCategory._id;
    
    let products = await Context.Product.find({
      categories: { $in: [currentCategory] }
    }).toArray();
    return products;
  }

  async find() {
    let product = await Context.Product.findOne({
      _id: this._id,
    });
    if (!product)
      return false;

    Object.assign(this, product);
    return true;
  }

  async create() {
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

  async remove() {
    let result = await Context.Product.remove({ _id: this._id });
    return result.acknowledged;
  }
}

module.exports = () => Product;
