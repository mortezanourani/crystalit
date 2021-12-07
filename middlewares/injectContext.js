const accountModel = require('../models/account');
const addressModel = require('../models/address');
const categoryModel = require('../models/category');
const informationModel = require('../models/information');
const itemModel = require('../models/item');
const orderModel = require('../models/order');
const productModel = require('../models/product');
const propertyModel = require('../models/property');

module.exports = (req, res, next) => {
  const Account = accountModel;
  Account.prototype._context = req.context;
  Account._context = req.context;

  const Address = addressModel;
  Address.prototype._context = req.context;
  Address._context = req.context;

  const Category = categoryModel;
  Category.prototype._context = req.context;
  Category._context = req.context;

  const Information = informationModel;
  Information.prototype._context = req.context;
  Information._context = req.context;

  const Item = itemModel;
  Item.prototype._context = req.context;
  Item._context = req.context;

  const Order = orderModel;
  Order.prototype._context = req.context;
  Order._context = req.context;

  const Product = productModel;
  Product.prototype._context = req.context;
  Product._context = req.context;

  const Property = propertyModel;
  Property.prototype._context = req.context;
  Property._context = req.context;

  req.context.models = {
    Account,
    Address,
    Category,
    Information,
    Item,
    Order,
    Product,
    Property,
  };
  next();
};
