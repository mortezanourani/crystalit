var express = require('express');
var router = express.Router();

const Product = require('../models/product');
const Item = require('../models/item');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let product = new Product();
  let products = await product.findAll();

  res.render('index', {
    title: 'CrystalIT | Shop',
    products: products,
  });
});

/* GET category page */
router.get('/category/:id', async function (req, res, next) {
  let product = new Product();
  let products = await product.findSome(req.params.id);

  res.render('category', {
    title: 'CrystalIT | Shop',
    products: products,
  });
});

/* GET specific product page */
router.get('/product/:id', async function (req, res, next) {
  let product = new Product();
  product._id = req.params.id;
  await product.find();

  res.render('product', {
    title: 'CrystalIT | Shop',
    product: product,
  });
});

/* GET add a product to cart */
router.get('/cart/add/:id', async function (req, res, next) {
  let product = new Product();
  product._id = req.params.id;
  await product.find();

  let item = new Item(product);

  let cart = req.session.cart || {};
  cart[product._id] = item;
  req.session.cart = cart;

  return res.redirect('/product/' + product._id);
});

/* GET cart page */
router.get('/cart', function (req, res, next) {
  let cart = req.session.cart || {};
  
  res.render('cart', {
    title: "CrystalIT | Cart",
    cart: cart,
  })
});

/* GET remove product from cart */
router.get('/cart/remove/:id', function (req, res, next) {
  let cart = req.session.cart || {};
  let productId = req.params.id;
  delete cart[productId];
  req.session.cart = cart;
  
  return res.redirect('/cart/');
});

module.exports = router;
