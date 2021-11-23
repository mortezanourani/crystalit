var express = require('express');
var router = express.Router();

const Category = require('../models/category');
const Property = require('../models/property');

/* GET Dashboard page. */
router.get('/', function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  res.render('dashboard/index', {
    title: 'CrystalIT | Dashboard'
  });
});

/* GET Category page. */
router.get('/category', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
    
  let message = res.locals.message;
  let category = new Category();
  let categories = new Array(0);
  categories = await category.findAll();
  res.render('dashboard/category', {
    title: 'CrytsalIT | Categories',
    categories: categories,
    message: message,
  });
});

/* GET Category create page. */
router.get('/category/add', function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
    
  res.render('dashboard/categoryAdd', {
    title: 'CrytsalIT | Create Category',
  });
});

/* POST Category create page. */
router.post('/category/add', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let category = new Category();
  let formCollection = req.body;
  Object.assign(category, formCollection);
  let acknowledged = await category.create();
  let message = 'Category created successfully.'
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/category/');
});

/* GET Category update page. */
router.get('/category/:id', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
    
  let category = new Category();
  category._id = req.params.id;
  await category.find();
  res.render('dashboard/categoryUpdate', {
    title: 'CrytsalIT | Create Category',
    category: category,
  });
});

/* POST Category update page. */
router.post('/category/:id', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let category = new Category();
  category._id = req.params.id;
  let formCollection = req.body;
  Object.assign(category, formCollection);
  let acknowledged = await category.update();
  let message = 'Category updated successfully.'
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/category/');
});

/* Category remove process */
router.get('/category/remove/:id', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let category = new Category();
  category._id = req.params.id;
  let acknowledged = await category.remove();
  message = 'Category removed successfully.';
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/category/');
});

/* GET Property page. */
router.get('/property', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
    
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
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
    
  res.render('dashboard/propertyAdd', {
    title: 'CrytsalIT | Create Property',
  });
});

/* POST Property create page. */
router.post('/property/add', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
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
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
    
  let property = new Property();
  property._id = req.params.id;
  await property.find();
  res.render('dashboard/propertyUpdate', {
    title: 'CrytsalIT | Create Property',
    property: property,
  });
});

/* POST Property update page. */
router.post('/property/:id', async function (req, res, next) {
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
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
  if (!req.isAuthenticated())
    return res.redirect('/account/login/');
  
  let property = new Property();
  property._id = req.params.id;
  let acknowledged = await property.remove();
  message = 'Property removed successfully.';
  if (!acknowledged)
    message = 'Something went wrong.';
  
  req.session.messages = [message];
  res.redirect('/dashboard/property/');
});

module.exports = router;
