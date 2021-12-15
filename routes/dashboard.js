var express = require('express');
var router = express.Router();

const Category = require('../models/category');
const Property = require('../models/property');
const Product = require('../models/product');
const Order = require('../models/order');

router.use((req, res, next) => {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  next();
});

/* GET Dashboard page. */
router.get('/', function (req, res, next) {
  res.render('dashboard/index', {
    title: 'CrystalIT | Dashboard',
    role: req.context.user.role,
  });
});

/* ROUTE order page */
router
  .route('/order')
  .get(async (req, res) => {
    let orders = await Order.findAll();

    res.render('dashboard/order', {
      title: 'CrystalIT | Orders',
      role: req.context.user.role,
      orders: orders,
    });
  })
  .post(async (req, res) => {
    let cart = req.session.cart;
    let cartItems = [];
    for (item of cart) {
      let product = await Product.findById(item.productId);
      cartItems.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        discount: product.discount,
      });
    }

    let formCollection = req.body;
    let address = JSON.parse(formCollection.address);
    delete address._id;
    let phone = formCollection.phone;
    let discountCode = formCollection.discount;

    const order = new Order({
      address: address,
      phoneNumber: phone,
      items: cartItems,
      discount: discountCode,
    });

    let acknowledged = await order.save();
    let message = 'Order submitted successfully.';
    if (!acknowledged) message = 'Something went wrong.';

    delete req.session.cart;
    req.session.messages = [message];
    res.redirect('/dashboard/order/' + order._id);
  });

router.get('/order/:id', async (req, res) => {
  let orderId = req.params.id;
  let order = await Order.findById(orderId);
  res.render('dashboard/order', {
    title: 'CrystalIT | Order',
    role: req.context.user.role,
    order: order,
  });
});

/* GET Category page. */
router.get('/category', async (req, res) => {
  let message = res.locals.message;
  let categories = await Category.findAll();

  res.render('dashboard/category', {
    title: 'CrytsalIT | Categories',
    role: req.context.user.role,
    categories: categories,
    message: message,
  });
});

/* GET Category create page. */
router
  .route('/category/add')
  .get(function (req, res, next) {
    res.render('dashboard/category.add.pug', {
      title: 'CrytsalIT | Create Category',
      role: req.context.user.role,
    });
  })
  .post(async (req, res) => {
    let formCollection = req.body;
    let category = new Category(formCollection);
    let acknowledged = await category.save();
    let message = 'Category created successfully.';
    if (!acknowledged)
      message = 'Something went wrong.';
    req.session.messages = [message];
    res.redirect('/dashboard/category/');
  });

/* ROUTE Category update page. */
router
  .route('/category/:id')
  .get(async (req, res) => {
    let categoryId = req.params.id;
    let category = await Category.findById(categoryId);
    res.render('dashboard/category.edit.pug', {
      title: 'CrytsalIT | Edit Category',
      role: req.context.user.role,
      category: category,
    });
  })
  .post(async (req, res,) => {
    let categoryId = req.params.id;
    let formCollection = req.body;
    let category = new Category(formCollection);
    category._id = categoryId;
    let acknowledged = await category.update();
    let message = 'Category updated successfully.'
    if (!acknowledged)
      message = 'Something went wrong.';
    req.session.messages = [message];
    res.redirect('/dashboard/category/');
  });

/* Category remove process */
router.get('/category/remove/:id', async (req, res) => {
  let categoryId = req.params.id;
  let category = await Category.findById(categoryId);
  let acknowledged = await category.delete();
  let message = 'Category removed successfully.';
  if (!acknowledged)
    message = 'Something went wrong.';
  req.session.messages = [message];
  res.redirect('/dashboard/category/');
});

/* GET Property page. */
router.get('/property', async function (req, res, next) {
  let message = res.locals.message;
  let property = new Property();
  let properties = new Array(0);
  properties = await property.findAll();
  res.render('dashboard/property', {
    title: 'CrytsalIT | Properties',
    properties: properties,
    message: message,
  });
});

/* GET Property create page. */
router.get('/property/add', function (req, res, next) {
  res.render('dashboard/propertyAdd', {
    title: 'CrytsalIT | Create Property',
  });
});

/* POST Property create page. */
router.post('/property/add', async function (req, res, next) {
  let property = new Property();
  let formCollection = req.body;
  Object.assign(property, formCollection);
  let acknowledged = await property.create();
  let message = 'Property created successfully.'
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/property/');
});

/* GET Property update page. */
router.get('/property/:id', async function (req, res, next) {
  let property = new Property();
  property._id = req.params.id;
  await property.find();
  res.render('dashboard/propertyUpdate', {
    title: 'CrytsalIT | Edit Property',
    property: property,
  });
});

/* POST Property update page. */
router.post('/property/:id', async function (req, res, next) {
  let property = new Property();
  property._id = req.params.id;
  let formCollection = req.body;
  Object.assign(property, formCollection);
  let acknowledged = await property.update();
  let message = 'Property updated successfully.'
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/property/');
});

/* Property remove process */
router.get('/property/remove/:id', async function (req, res, next) {
  let property = new Property();
  property._id = req.params.id;
  let acknowledged = await property.remove();
  message = 'Property removed successfully.';
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/property/');
});

/* GET Product page. */
router.get('/product', async function (req, res, next) {
  let message = res.locals.message;
  let product = new Product();
  let products = new Array(0);
  products = await product.findAll();

  res.render('dashboard/product', {
    title: 'CrytsalIT | Products',
    products: products,
    message: message,
  });
});

/* GET Product create page. */
router.get('/product/add', async function (req, res, next) {
  let category = new Category();
  let categories = new Array(0);
  categories = await category.findAll();

  let property = new Property();
  let properties = new Array(0);
  properties = await property.findAll();

  res.render('dashboard/productAdd', {
    title: 'CrytsalIT | Create Product',
    categories: categories,
    properties: properties,
  });
});

/* POST Product create page. */
router.post('/product/add', async function (req, res, next) {
  let formCollection = req.body;

  let product = new Product();
  product.title = formCollection.title;
  product.count = formCollection.count;
  product.price = formCollection.price;
  product.discount = formCollection.discount;
  
  let categories = [];
  if (typeof formCollection.categories !== 'object')
    formCollection.categories = [formCollection.categories];
  for (formCategory of formCollection.categories) {
    let category = new Category();
    category._id = formCategory;
    await category.find();
    delete category._id;
    categories.push(category);
  }
  product.categories = categories;
  if (product.categories[0].name === '')
    delete product.categories;

  let property = new Property();
  let properties = await property.findAll();
  for (let property of properties) {
    if (formCollection[property.name] === '')
      continue;
    delete property._id;
    property.value = formCollection[property.name];
    product.properties.push(property);
  }
  if (product.properties.length === 0)
    delete product.properties;
  
  let acknowledged = await product.create();
  let message = 'Product created successfully.'
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/product/');
});

/* GET Product update page. */
router.get('/product/:id', async function (req, res, next) {
  let category = new Category();
  let categories = new Array(0);
  categories = await category.findAll();

  let property = new Property();
  let properties = new Array(0);
  properties = await property.findAll();

  let product = new Product();
  product._id = req.params.id;
  await product.find();
  res.render('dashboard/productUpdate', {
    title: 'CrytsalIT | Edit Product',
    categories: categories,
    properties: properties,
    product: product,
  });
});

/* POST Product update page. */
router.post('/product/:id', async function (req, res, next) {
  let formCollection = req.body;

  let product = new Product();
  product._id = req.params.id;
  product.title = formCollection.title;
  product.count = formCollection.count;
  product.price = formCollection.price;
  product.discount = formCollection.discount;

  let categories = [];
  if (typeof formCollection.categories !== 'object')
    formCollection.categories = [formCollection.categories];
  for (formCategory of formCollection.categories) {
    let category = new Category();
    category._id = formCategory;
    await category.find();
    delete category._id;
    categories.push(category);
  }
  product.categories = categories;
  if (product.categories[0].name === '')
    delete product.categories;

  let property = new Property();
  let properties = await property.findAll();
  for (let property of properties) {
    if (formCollection[property.name] === '')
      continue;
    delete property._id;
    property.value = formCollection[property.name];
    product.properties.push(property);
  }
  if (product.properties.length === 0)
    delete product.properties;

  let acknowledged = await product.update();
  let message = 'Product updated successfully.';
  if (!acknowledged) message = 'Something went wrong.';

  req.session.messages = [message];
  res.redirect('/dashboard/product/');
});

/* Product remove process */
router.get('/product/remove/:id', async function (req, res, next) {
  let product = new Product();
  product._id = req.params.id;
  let acknowledged = await product.remove();
  message = 'Product removed successfully.';
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/product/');
});

module.exports = router;
