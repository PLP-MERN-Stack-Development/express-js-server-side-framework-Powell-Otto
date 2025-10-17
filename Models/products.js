const mongoose = require('mongoose');

// Define schema (rules to follow to create collections aka tables in the DB)
const productsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    inStock: { type: Boolean, required: true },
}, { timestamps: true });

// Create the model (represents collections aka tables)
const Products = mongoose.model("Products", productsSchema)

module.exports = Products;