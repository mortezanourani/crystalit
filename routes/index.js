var express = require('express');
var router = express.Router();

const Product = require('../models/product');

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

module.exports = router;
