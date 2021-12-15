const CATEGORIES = require('../middlewares/mongoContext').Category;
const uuid = require('uuid');

class Category {
  constructor({ _id, name, title }) {
    this._id = _id;
    this.name = name;
    this.title = title;
  }

  static async findByName(categoryName) {
    let category = await CATEGORIES.findOne({
      name: categoryName,
    });
    return new Category(category);
  }

  static async findById(categoryId) {
    let category = await CATEGORIES.findOne({
      _id: categoryId,
    });
    return new Category(category);
  }

  static async findAll() {
    let categories = await CATEGORIES.find({}).toArray();
    return categories;
  }

  async save() {
    let category = {
      _id: uuid.v1()
        .split('-')
        .join(''),
      name: this.name,
      title: this.title,
    }
    let result = await CATEGORIES.insertOne(category);
    return result.acknowledged;
  }

  async update() {
    let result = await CATEGORIES.updateOne(
      { _id: this._id },
      {
        $set: {
          name: this.name,
          title: this.title
        }
      }
    );
    return result.acknowledged;
  }

  async delete() {
    let result = await CATEGORIES.deleteOne({ _id: this._id });
    return result.acknowledged;
  }
}

module.exports = Category;
