const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: String,

    price: {
        type: Number,
        required: true
    },

    category: String,

    image: String,

    stock: {
        type: Number,
        default: 0
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Product", productSchema);