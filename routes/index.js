var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res) {
  const { Product } = req.context.models;
  let products = await Product.find();
  res.render('index', {
    title: 'CrystalIT | Shop',
    products: products,
  });
});

/* GET category page */
router.get('/category/:name', async function (req, res, next) {
  const { Product } = req.context.models;
  let categoryName = req.params.name;
  let products = await Product.findByCategory(categoryName);
  res.render('category', {
    title: 'CrystalIT | Shop',
    products: products,
  });
});

/* GET specific product page */
router.get('/product/:id', async function (req, res, next) {
  const { Product } = req.context.models;
  let productId = req.params.id;
  let product = await Product.findById(productId);
  res.render('product', {
    title: 'CrystalIT | Shop',
    product: product,
  });
});

module.exports = router;
