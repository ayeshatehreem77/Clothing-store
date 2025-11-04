const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Variant = require('../models/Variants');
const Perfume = require('../models/Perfumes');
const fetchuser = require('../middleware/fetchuser');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();
const isId = (id) => mongoose.Types.ObjectId.isValid(id);

//  Route 1. GET /api/variant/perfume , Get all variants for a specific perfume (Public)

router.get('/perfume/:perfumeId', async (req, res) => {
  try {
    const { perfumeId } = req.params;
    if (!isId(perfumeId)) return res.status(400).json({ error: 'Invalid perfume id' });

    const variants = await Variant.find({ perfume: perfumeId }).sort({ price: 1 });
    res.json(variants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Route 2. POST /api/variant/:perfumeid/add Add new variant to a perfume (Admin)

router.post(
  '/:perfumeId/add',
  fetchuser,
  isAdmin,
  [
    body('sizeML').isInt({ min: 1 }).withMessage('Size must be a positive integer'),
    body('sku').isString().trim().notEmpty().withMessage('SKU is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be non-negative')
  ],
  async (req, res) => {
    try {
      const { perfumeId } = req.params;

      // ✅ Validate perfumeId
      if (!isId(perfumeId)) return res.status(400).json({ error: 'Invalid perfume id' });

      // ✅ Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { sizeML, sku, price, stock } = req.body;

      // ✅ Ensure perfume exists
      const perfumeExists = await Perfume.findById(perfumeId);
      if (!perfumeExists) return res.status(404).json({ error: 'Perfume not found' });

      // ✅ Create variant
      const variant = await Variant.create({
        perfume: perfumeId,
        sizeML,
        sku: sku.toUpperCase().trim(),
        price,
        stock: stock || 0
      });

      res.status(201).json(variant);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Duplicate SKU for this perfume' });
      }
      res.status(500).json({ error: err.message });
    }
  }
);


// Route 3. PUT /api/variant , Update a variant (Admin)
router.put('/:variantId', fetchuser, isAdmin, async (req, res) => {
  try {
    const { variantId } = req.params;
    if (!isId(variantId)) return res.status(400).json({ error: 'Invalid variant id' });

    const updated = await Variant.findByIdAndUpdate(
      variantId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'Variant not found' });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Duplicate SKU for this perfume' });
    }
    res.status(500).json({ error: err.message });
  }
});


// Route 4. DELETE /api/variant , Delete a variant (Admin)
router.delete('/:variantId', fetchuser, isAdmin, async (req, res) => {
  try {
    const { variantId } = req.params;
    if (!isId(variantId)) return res.status(400).json({ error: 'Invalid variant id' });

    const deleted = await Variant.findByIdAndDelete(variantId);
    if (!deleted) return res.status(404).json({ error: 'Variant not found' });

    res.json({ success: true, message: 'Variant deleted successfully', variant: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
