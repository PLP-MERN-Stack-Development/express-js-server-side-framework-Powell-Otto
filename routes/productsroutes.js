const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Products = require('../Models/products');
const validateProduct = require('../middleware/validateProduct');
const auth = require('../middleware/auth');
const { NotFoundError } = require('../middleware/errorHandler');

// Helper: Async wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 🔹 GET /api/products - List all products (filter, pagination)
router.get('/', asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 5 } = req.query;
  const filter = category ? { category } : {};

  const products = await Products.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Products.countDocuments(filter);
  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products
  });
}));

//  Search products
router.get('/search', asyncHandler(async (req, res) => {
  const { name } = req.query;
  const products = await Products.find({ name: new RegExp(name, 'i') });
  res.json(products);
}));

// 🔹 GET /api/products/stats - Product statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Products.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);
  res.json(stats);
}));



// Get all students (fetch all) READ
router.get("/", async (req, res) => {
    try {
        const products = await Products.find();
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

// 🔹 GET /api/products/:id - Get product by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Products.findById(req.params.id);
  if (!product) throw new NotFoundError('Product not found');
  res.json(product);
}));

// 🔹 POST /api/products - Create product
router.post('/', /*auth, validateProduct,*/ asyncHandler(async (req, res) => {
  const product = new Products(req.body);
  const saved = await product.save();
  res.status(201).json(saved);
}));

// 🔹 PUT /api/products/:id - Update product
router.put('/:id', auth, validateProduct, asyncHandler(async (req, res) => {
  const updated = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) throw new NotFoundError('Product not found');
  res.json(updated);
}));

// 🔹 DELETE /api/products/:id - Delete product
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  const deleted = await Products.findByIdAndDelete(req.params.id);
  if (!deleted) throw new NotFoundError('Product not found');
  res.json({ message: 'Product deleted successfully', deleted });
}));

module.exports = router;
