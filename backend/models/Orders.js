const mongoose = require('mongoose')
const { Schema } = mongoose

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    },
    orderItems: [
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
                min: 1
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentInfo: {
        method: { type: String, required: true }, // e.g. 'COD', 'Stripe', 'PayPal'
        status: { type: String, default: 'pending' }, // 'pending', 'paid', 'failed'
        transactionId: { type: String } // Stripe/PayPal transaction ID
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true }) 

module.exports = mongoose.model('order', OrderSchema)
