var express = require('express');
var router = express.Router();

const Product = require('../models/product');
const Category = require('../models/category');

/* GET home page. */
router
  .get('/', async (req, res) => {
    let products = await Product.find();
    let categories = await Category.findAll();
    res.render('index', {
      title: 'CrystalIT | Shop',
      products: products,
      categories: categories,
    });
  });

/* GET category page */
router
  .get('/category/:name', async (req, res) => {
    let categoryName = req.params.name;
    let categories = await Category.findAll();
    let category = await Category.findByName(categoryName);
    let products = await Product.findByCategory(categoryName);
    res.render('category', {
      title: category.title,
      categories: categories,
      products: products,
    });
  });

/* GET specific product page */
router
  .get('/product/:id', async (req, res) => {
    let productId = req.params.id;
    let product = await Product.findById(productId);
    res.render('product', {
      title: 'CrystalIT | Shop',
      product: product,
    });
  });

module.exports = router;
