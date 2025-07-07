const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search, category } = req.query;
  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;

  try {
    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((page - 1) * limit);
    const total = await Product.countDocuments(query);
    res.json({ products, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth(['admin']), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth(['admin']), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;