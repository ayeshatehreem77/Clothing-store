const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Perfume = require('../models/Perfumes');
const Variant = require('../models/Variants');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Route 1:  Add item to cart
router.post('/add', fetchuser,[
    body("items.*.perfume").isMongoId().withMessage("Perfume ID is invalid"),
    body("items.*.variant").isMongoId().withMessage("Variant ID is invalid"),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("items.*.price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0")
  ], async (req, res) => {
  try {
    const { perfume, variant, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(perfume) || !mongoose.Types.ObjectId.isValid(variant)) {
      return res.status(400).json({ error: 'Invalid perfume or variant ID' });
    }

    const perfumeExists = await Perfume.findById(perfume);
    const variantExists = await Variant.findById(variant);

    if (!perfumeExists || !variantExists) {
      return res.status(404).json({ error: 'Perfume or variant not found' });
    }

    // Find existing cart for user
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.variant.toString() === variant
    );

    if (itemIndex > -1) {
      // Update quantity if item already exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        perfume,
        variant,
        quantity,
        price: variantExists.price
      });
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

// Route 2: Get user cart
router.get('/', fetchuser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.perfume', 'name brand')
      .populate('items.variant', 'sizeML price stock');

    if (!cart) return res.json({ items: [] });

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

// Route 3: Update quantity
router.put('/update/:variantId', fetchuser, async (req, res) => {
  try {
    const { variantId } = req.params;
    const { quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      (item) => item.variant.toString() === variantId
    );
    if (itemIndex === -1) return res.status(404).json({ error: 'Item not found in cart' });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

// Route 4: Remove item
router.delete('/remove/:variantId', fetchuser, async (req, res) => {
  try {
    const { variantId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.variant.toString() !== variantId
    );
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
