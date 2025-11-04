const mongoose = require('mongoose');
const { Schema } = mongoose;

const PerfumeSchema = new Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
  brand: { type: Schema.Types.ObjectId, ref: 'brand', required: true },
  price: { type: Number, required: true },

  gender: { type: String, enum: ['men', 'women', 'unisex'], default: 'unisex', index: true },
  concentration: { type: String, enum: ['EDT', 'EDP', 'Parfum', 'Extrait', 'Cologne'], required: true, index: true },

  featured: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  new: { type: Boolean, default: false },

  description: String,
  notes: { top: [String], middle: [String], base: [String] },
  accords: [String],
  images: [{ url: { type: String, required: true }, publicId: String }],

  rating: { type: Number, min: 0, max: 5, default: 0 },
  numReviews: { type: Number, min: 0, default: 0 },
}, { timestamps: true });

PerfumeSchema.index({ name: 'text', description: 'text', accords: 'text' });
PerfumeSchema.index({ brand: 1, gender: 1, concentration: 1, createdAt: -1 });

module.exports = mongoose.model('Perfume', PerfumeSchema);
