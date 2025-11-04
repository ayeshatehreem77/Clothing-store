const express = require('express');
const { body, validationResult } = require('express-validator');
const Brand = require('../models/Brand');
const fetchuser = require('../middleware/fetchuser');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// GET /api/brand  (public)
router.get('/', async (_req, res) => {
  const brands = await Brand.find().sort({ name: 1 });
  res.json(brands);
});

// GET /api/brand/:slug (public)
router.get('/:slug', async (req, res) => {
  const b = await Brand.findOne({ slug: req.params.slug });
  if (!b) return res.status(404).json({ error: 'Brand not found' });
  res.json(b);
});

// POST /api/brand/add  (admin)
router.post(
  '/add',
  fetchuser, isAdmin,
  [
    body('name').trim().isLength({ min: 2 }),
    body('slug').trim().isLength({ min: 2 }).toLowerCase()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const brand = await Brand.create(req.body);
      res.status(201).json(brand);
    } catch (e) {
      if (e.code === 11000) return res.status(400).json({ error: 'Duplicate name/slug' });
      res.status(500).send('Internal server error');
    }
  }
);

// ---------- UPDATE BRAND ----------
// PUT /api/brand/update/:id (admin)
router.put(
  '/update/:id',
  fetchuser, isAdmin,
  [
    body('name').optional().trim().isLength({ min: 2 }),
    body('slug').optional().trim().isLength({ min: 2 }).toLowerCase()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { id } = req.params;

      const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true }
      );

      if (!updatedBrand) return res.status(404).json({ error: 'Brand not found' });

      res.json(updatedBrand);
    } catch (e) {
      if (e.code === 11000) return res.status(400).json({ error: 'Duplicate name/slug' });
      console.error(e);
      res.status(500).send('Internal server error');
    }
  }
);

// ---------- DELETE BRAND ----------
// DELETE /api/brand/delete/:id (admin)
router.delete('/delete/:id', fetchuser, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) return res.status(404).json({ error: 'Brand not found' });

    res.json({ message: 'Brand deleted successfully', deletedBrand });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
