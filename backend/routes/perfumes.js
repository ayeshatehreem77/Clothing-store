
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const Perfume = require('../models/Perfumes'); // your Product model
const User = require('../models/User');        //  admin check
const isAdmin   = require('../middleware/isAdmin');
const fetchuser = require('../middleware/fetchuser')



const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Resolve admin
async function ensureAdmin(req, res, next) {
  try {
    const uid = req.user?.id || req.user?._id || req.user;
    if (!uid) return res.status(401).json({ error: 'Not authenticated' });

    // if role already present, use it; else fetch user
    let role = req.user?.role;
    if (!role) {
      const u = await User.findById(uid).select('role');
      if (!u) return res.status(401).json({ error: 'User not found' });
      role = u.role;
    }
    if (role !== 'admin') return res.status(403).json({ error: 'Access denied. Admin only.' });
    next();
  } catch (e) {
    console.error('ensureAdmin error:', e);
    res.status(500).send('Internal server error');
  }
}

// ---------- GET: list (public) ----------
// GET /api/perfumes/fetchall?q=&brand=&gender=&concentration=&page=1&limit=12&sort=newest|price_asc|price_desc|rating
router.get('/fetchall', async (req, res) => {
  try {
    const {
      q, brand, gender, concentration,
      page = 1, limit = 12, sort = 'newest'
    } = req.query;

    const filter = {};
    if (q) filter.$text = { $search: q };
    if (brand && isValidId(brand)) filter.brand = brand;
    if (gender) filter.gender = gender;
    if (concentration) filter.concentration = concentration;

    const sortMap = {
      newest:     { createdAt: -1 },
      price_asc:  { 'variants.price': 1 },
      price_desc: { 'variants.price': -1 },
      rating:     { rating: -1 }
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Perfume.find(filter)
        .populate('brand', 'name slug')
        .sort(sortMap[sort] || sortMap.newest)
        .skip(skip)
        .limit(Number(limit)),
      Perfume.countDocuments(filter)
    ]);

    res.json({
      data: items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
  }
});

// ---------- GET: detail by slug (public) ----------
// GET /api/perfumes/:slug
router.get('/:slug', async (req, res) => {
  try {
    const perfume = await Perfume.findOne({ slug: req.params.slug })
      .populate('brand', 'name slug');
    if (!perfume) return res.status(404).json({ error: 'Perfume not found' });
    res.json(perfume);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
  }
});

// (optional) GET by id for admin tools
// GET /api/perfumes/id/:id
router.get('/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid id' });
    const perfume = await Perfume.findById(id).populate('brand', 'name slug');
    if (!perfume) return res.status(404).json({ error: 'Perfume not found' });
    res.json(perfume);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
  }
});

// ---------- POST: create (admin only) ----------
// POST /api/perfumes/add
router.post(
  '/add',
  fetchuser,
  ensureAdmin,
  [
    body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 chars'),
    body('slug').isLength({ min: 2 }).withMessage('Slug is required'),
    body('brand').custom(v => isValidId(v)).withMessage('Invalid brand id'),
    body('gender').optional().isIn(['men','women','unisex']).withMessage('Invalid gender'),
    body('concentration').isIn(['EDT','EDP','Parfum','Extrait','Cologne']).withMessage('Invalid concentration')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const doc = await Perfume.create(req.body);
      res.status(201).json(doc);
    } catch (e) {
      console.error(e);
      if (e.code === 11000) {
        // duplicate slug or sku
        return res.status(400).json({ error: 'Duplicate key', key: e.keyValue });
      }
      res.status(500).send('Internal server error');
    }
  }
);

// ---------- PUT: update (admin only) ----------
// PUT /api/perfumes/update/:id
router.put('/update/:id', fetchuser, ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid id' });

    const updated = await Perfume.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res.status(400).json({ error: 'Duplicate key', key: e.keyValue });
    }
    res.status(500).send('Internal server error');
  }
});

// ---------- DELETE: remove (admin only) ----------
// DELETE /api/perfumes/delete/:id
router.delete('/delete/:id', fetchuser, ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid id' });

    const deleted = await Perfume.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.json({ success: true, message: 'Perfume deleted', perfume: deleted });
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
