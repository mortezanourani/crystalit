const uuid = require('uuid');

class Category {
  name = new String();
  title = new String();

  constructor() {
    this.name = '';
    this.title = '';
  }

  async find() {
    let category = await Context.Category.findOne({
      _id: this._id,
    });
    if (!category)
      return false;
    
    Object.assign(this, category);
    return true;
  }

  async findAll() {
    let categories = await Context.Category.find({}).toArray();
    return categories;
  }

  async create() {
    let categoryId = uuid.v1()
      .split('-')
      .join('');
    this._id = categoryId;
    let result = await Context.Category.insertOne(this);
    if (!result)
      return false;
    return true;
  }

  async update() {
    let result = await Context.Category.updateOne(
      { _id: this._id },
      { $set: { name: this.name, title: this.title } }
    );

    if (!result)
      return false;
    return true;
  }

  async remove() {
    let result = await Context.Category.remove({ _id: this._id });
    return result.acknowledged;
  }
}

module.exports = () => Category;