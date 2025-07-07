const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

router.post('/', auth(['customer']), async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || !cart.items.length) return res.status(400).json({ error: 'Cart is empty' });

    const items = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price
    }));

    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const order = new Order({ userId: req.user.id, items, total });
    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;