const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true  // ensures one cart per user
    },
    items: [
        {
            perfume: {
                type: Schema.Types.ObjectId,
                ref: 'Perfume',
                required: true
            },
            variant: {
                type: Schema.Types.ObjectId,
                ref: 'Variant',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    total: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('cart', CartSchema);
