const {ValidationError} = require('./errorHandler');

function validateProduct(req, res, next) {
    const {name, description, price, category, inStock} = req.body;
    if (!name || !description || price == null || !category || inStock == null) {
        throw new ValidationError('Missing required product fields');
    }
    next();

}

module.exports = validateProduct;