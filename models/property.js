const uuid = require('uuid');
const PROPERTIES = require('../middlewares/mongoContext').Property;

class Property {
  constructor({ _id, name, title, unit }) {
    this._id = _id;
    this.name = name;
    this.title = title;
    this.unit = unit;
  }

  static async findById(propertyId) {
    let property = await PROPERTIES.findOne({
      _id: propertyId,
    });
    return new Property(property);
  }

  static async findAll() {
    let properties = await PROPERTIES.find({}).toArray();
    return properties;
  }

  async save() {
    let property = {
      _id: uuid.v1()
        .split('-')
        .join(''),
      name: this.name,
      title: this.title,
      unit: this.unit,
    }
    let result = await PROPERTIES.insertOne(property);
    return result.acknowledged;
  }

  async update() {
    let result = await PROPERTIES.updateOne(
      { _id: this._id },
      {
        $set: {
          name: this.name,
          title: this.title,
          unit: this.unit,
        }
      }
    );
    return result.acknowledged;
  }

  async delete() {
    let result = await PROPERTIES.deleteOne({ _id: this._id });
    return result.acknowledged;
  }
}

module.exports = Property;
