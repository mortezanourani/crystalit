var express = require('express');
var router = express.Router();

const Product = require('../models/product');
const Item = require('../models/item');

/* GET add a product to cart */
router.get('/add/:id', async function (req, res, next) {
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
router.get('/', function (req, res, next) {
  let cart = req.session.cart || {};
  
  res.render('cart/index', {
    title: "CrystalIT | Cart",
    cart: cart,
  })
});

/* GET remove product from cart */
router.get('/remove/:id', function (req, res, next) {
  let cart = req.session.cart || {};
  let productId = req.params.id;
  delete cart[productId];
  req.session.cart = cart;
  
  return res.redirect('/cart/');
});

module.exports = router;