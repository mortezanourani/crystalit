var express = require('express');
var router = express.Router();

const Product = require('../models/product');
const Account = require('../models/account');
const Item = require('../models/item');


/* ROUTE cart page */
router.route('/')
  .get(async (req, res) => {
    let cart = req.session.cart || [];
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
    res.render('cart/index', {
      title: 'CrystalIT | Cart',
      cart: cartItems,
    });
  })
  .post(async (req, res) => {
    let productId = req.body.productId;
    let product = await Product.findById(productId);
    let item = {
      productId: product._id,
      count: 1,
    };
    let cart = req.session.cart || [];
    let isDuplicated = false;
    for (let cartItem of cart) {
      if (cartItem.productId === item.productId) {
        isDuplicated = true;
        break;
      }
    }
    if (!isDuplicated)
      cart.push(item);
    req.session.cart = cart;
    return res.redirect('/product/' + product._id);
  });
router.get('/delete/:id', (req, res) => {
  let cart = req.session.cart || [];
  let productId = req.params.id;
  let cartItem = [];
  for (let item of cart) {
    if (item.productId !== productId)
      cartItem.push(item);
  }
  console.log(cartItem);
  req.session.cart = cartItem;
  return res.redirect('/cart/');
});

/* GET cart checkout page */
router.route('/checkout')
  .all((req, res, next) => {
    if (!req.isAuthenticated())
      return res.redirect('/account/login/');
    next();
  })
  .get(async (req, res) => {
    let user = await Account.findById();
    let cart = req.session.cart || [];
    let cartItems = [];
    for (item of cart) {
      let product = await Product.findById(item.productId);
      // cartItems.push({
      //   productId: product._id,
      //   title: product.title,
      //   price: product.price,
      //   discount: product.discount,
      // });
      cartItems.push(product);
    }
    res.render('cart/checkout', {
      title: "CrystalIT | Cart Checkout",
      user: user,
      cart: cartItems,
    });
  });

module.exports = router;