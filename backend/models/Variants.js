const mongoose = require('mongoose');
const { Schema } = mongoose;

const VariantSchema = new Schema({
  perfume: { type: Schema.Types.ObjectId, ref: 'Perfume', required: true, index: true },
  sizeML:  { type: Number, required: true },
  sku:     { type: String, required: true, trim: true },
  price:   { type: Number, required: true, min: 0 },
  stock:   { type: Number, required: true, min: 0, default: 0 }
}, { timestamps: true });

// enforce unique SKU per perfume
VariantSchema.index({ perfume: 1, sku: 1 }, { unique: true });

module.exports = mongoose.model('Variant', VariantSchema);
