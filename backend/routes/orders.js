const express = require('express')
const router = express.Router()
const Order = require('../models/Orders')
const fetchuser = require('../middleware/fetchuser')
const isAdmin = require('../middleware/isAdmin')
const { body, validationResult } = require('express-validator');

// Router 1: POST /api/orders, Create a new order, accessed by Private (User) 
router.post('/', fetchuser,[
    body("orderItems").isArray({ min: 1 }).withMessage("Order must have at least one item"),
    body("orderItems.*.perfume").isMongoId().withMessage("Perfume ID is invalid"),
    body("orderItems.*.variant").isMongoId().withMessage("Variant ID is invalid"),
    body("orderItems.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
    body("orderItems.*.price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),

    body("shippingAddress.fullName").notEmpty().withMessage("Full name is required"),
    body("shippingAddress.address").notEmpty().withMessage("Address is required"),
    body("shippingAddress.city").notEmpty().withMessage("City is required"),
    body("shippingAddress.postalCode").notEmpty().withMessage("Postal code is required"),
    body("shippingAddress.country").notEmpty().withMessage("Country is required"),
    body("shippingAddress.phone").notEmpty().withMessage("Phone is required"),

    body("paymentInfo.method")
      .isIn(["COD", "Stripe", "PayPal"])
      .withMessage("Invalid payment method"),
  ], async (req, res) => {
    try {
        const order = new Order({
            user: req.user.id,
            ...req.body
        })
        const savedOrder = await order.save()
        res.status(201).json(savedOrder)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


// Router 2: GET /api/orders/myorders, Get logged-in user’s orders, accessed by Private (User) 
router.get('/myorders', fetchuser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('orderItems.perfume orderItems.variant')
        res.json(orders)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Route 3:   GET /orders/:id, single order by ID, accessed by Private (User/Admin) 
router.get('/:id', fetchuser, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('orderItems.perfume orderItems.variant user')
        if (!order) return res.status(404).json({ msg: 'Order not found' })

        // only allow owner OR admin
        if (order.user._id.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ msg: 'Not authorized' })
        }

        res.json(order)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Route 4:   PUT /orders/:id/status, Update order status, accessed by Private (Admin)
router.put('/:id/status', fetchuser, isAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (!order) return res.status(404).json({ msg: 'Order not found' })

        order.orderStatus = req.body.status || order.orderStatus
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// Route 5:   GET /orders, Get all orders, accessed by Private (Admin)
router.get('/', fetchuser, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email')
        res.json(orders)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
