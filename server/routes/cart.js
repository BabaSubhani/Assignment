const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

router.get('/', auth(['customer']), async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth(['customer']), async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:productId', auth(['customer']), async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    const item = cart.items.find(item => item.productId.toString() === req.params.productId);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:productId', auth(['customer']), async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;