const mongoose = require('mongoose')
const { Schema } = mongoose

const BrandSchema = new Schema({
    // here we'll store the brand's info
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    }
})

module.exports = mongoose.model('brand', BrandSchema)