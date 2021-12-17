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

/* ROUTE Category create page. */
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
// Category .delete route method
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

/* ROUTE Property page. */
router.route('/property')
  .get(async (req, res) => {
    let message = res.locals.message;
    let properties = await Property.findAll();
    res.render('dashboard/property', {
      title: 'CrytsalIT | Properties',
      role: req.context.user.role,
      properties: properties,
      message: message,
    });
  });

/* ROUTE Property create page. */
router
  .route('/property/add')
  .get((req, res) => {
    res.render('dashboard/property.add.pug', {
      title: 'CrytsalIT | Create Property',
      role: req.context.user.role,
    });
  })
  .post(async (req, res) => {
    let formCollection = req.body;
    let property = new Property(formCollection);
    let acknowledged = await property.save();
    let message = 'Property created successfully.'
    if (!acknowledged)
      message = 'Something went wrong.';
    req.session.messages = [message];
    res.redirect('/dashboard/property/');
  });

/* ROUTE Property edit page. */
router
  .route('/property/:id')
  .get(async (req, res) => {
    let propertyId = req.params.id;
    let property = await Property.findById(propertyId);
    res.render('dashboard/property.edit.pug', {
      title: 'CrytsalIT | Edit Property',
      role: req.context.user.role,
      property: property,
    });
  })
  .post(async (req, res) => {
    let propertyId = req.params.id;
    let formCollection = req.body;
    let property = new Property(formCollection);
    property._id = propertyId;
    let acknowledged = await property.update();
    let message = 'Property updated successfully.'
    if (!acknowledged)
      message = 'Something went wrong.';
    req.session.messages = [message];
    res.redirect('/dashboard/property/');
  });
// Property .delete process
router.get('/property/remove/:id', async (req, res) => {
  let propertyId = req.params.id;
  let property = await Property.findById(propertyId);
  let acknowledged = await property.delete();
  let message = 'Property removed successfully.';
  if (!acknowledged)
    message = 'Something went wrong.';
  req.session.messages = [message];
  res.redirect('/dashboard/property/');
});

/* ROUTE Product page. */
router
  .route('/product')
  .get(async (req, res) => {
    let message = res.locals.message;
    let products = await Product.find();
    res.render('dashboard/product', {
      title: 'CrytsalIT | Products',
      role: req.context.user.role,
      products: products,
      message: message,
    });
  });

/* ROUTE Product create page. */
router
  .route('/product/add')
  .get(async (req, res) => {
    let categories = await Category.findAll();
    let properties = await Property.findAll();
    res.render('dashboard/product.add.pug', {
      title: 'CrytsalIT | Create Product',
      role: req.context.user.role,
      categories: categories,
      properties: properties,
    });
  })
  .post(async (req, res) => {
    let formCollection = req.body;
    
    let categoriesIdArray = formCollection.categories;
    let categories = await Category.findManyById(categoriesIdArray);

    let propertiesValueArray = formCollection.properties;
    let properties = await Property.findMany(propertiesValueArray);

    let images = [];

    let product = new Product({
      title: formCollection.title,
      categories,
      properties,
      images,
      count: formCollection.count,
      price: formCollection.price,
      discount: formCollection.discount,
    });

    let acknowledged = await product.save();
    let message = 'Product created successfully.'
    if (!acknowledged)
      message = 'Something went wrong.';

    req.session.messages = [message];
    res.redirect('/dashboard/product/');
  });

/* GET Product update page. */
router.route('/product/:id')
  .get(async (req, res) => {
    let categories = await Category.findAll();
    let properties = await Property.findAll();
    let productId = req.params.id;
    let product = await Product.findById(productId);
    res.render('dashboard/product.edit.pug', {
      title: 'CrytsalIT | Edit Product',
      role: req.context.user.role,
      categories: categories,
      properties: properties,
      product: product,
    });
  })
  .post(async (req, res) => {
    let productId = req.params.id;
    let formCollection = req.body;

    let categoriesIdArray = formCollection.categories;
    let categories = await Category.findManyById(categoriesIdArray);

    let propertiesValueArray = formCollection.properties;
    let properties = await Property.findMany(propertiesValueArray);

    let images = [];

    let product = new Product({
      _id: productId,
      title: formCollection.title,
      categories,
      properties,
      images,
      count: formCollection.count,
      price: formCollection.price,
      discount: formCollection.discount,
    });
    let acknowledged = await product.update();
    let message = 'Product updated successfully.';
    if (!acknowledged)
      message = 'Something went wrong.';

    req.session.messages = [message];
    res.redirect('/dashboard/product/');
  })
// Product delete process */
router
  .route('/product/remove/:id')
  .get(async (req, res) => {
    let productId = req.params.id;
    let product = await Product.findById(productId);
    let acknowledged = await product.delete();
    let message = 'Product removed successfully.';
    if (!acknowledged)
      message = 'Something went wrong.';
    req.session.messages = [message];
    res.redirect('/dashboard/product/');
  });

module.exports = router;
