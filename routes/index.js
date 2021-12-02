var express = require('express');
var router = express.Router();

const Product = require('../models/product');
const Item = require('../models/item');

router.use(function (req, res, next) {
  const Models = req.context.models;
  console.clear();
  console.log(Models.Product);
});

/* GET home page. */
router.get('/', async function (req, res, next) {
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

module.exports = router;
