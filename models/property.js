const uuid = require('uuid');

class Property {
  name = new String();
  title = new String();
  unit = new String();

  constructor() {
    this.name = '';
    this.title = '';
    this.unit = '';
  }

  async find() {
    let property = await Context.Property.findOne({
      _id: this._id,
    });
    if (!property) return false;

    Object.assign(this, property);
    return true;
  }

  async findAll() {
    let properties = await Context.Property.find({}).toArray();
    return properties;
  }

  async create() {
    let propertyId = uuid.v1()
      .split('-')
      .join('');
    this._id = propertyId;
    let result = await Context.Property.insertOne(this);
    if (!result) return false;
    return true;
  }

  async update() {
    let result = await Context.Property.updateOne(
      { _id: this._id },
      { $set: { name: this.name, title: this.title } }
    );

    if (!result) return false;
    return true;
  }

  async remove() {
    let result = await Context.Property.remove({ _id: this._id });
    return result.acknowledged;
  }
}

module.exports = Property;
