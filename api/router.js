// api/router.js
const express = require('express');
const User = require('./Users');
const Product = require('./Products');
const Order = require('./Orders');

const router = express.Router();

// ----- Users -----
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.put('/users/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----- Products -----
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('seller');
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller');
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post('/products', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ----- Orders -----
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('products.product');
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('products.product');
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.post('/orders', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.json(newOrder);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.put('/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router.delete('/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
