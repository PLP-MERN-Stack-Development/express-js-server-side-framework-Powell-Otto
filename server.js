const express = require('express');
const dotenv = require('dotenv');
const connectDB  = require('./config/db');
const productRoutes = require('./routes/productsroutes');
const logger = require('./middleware/logger');
const { errorHandler, NotFoundError } = require('./middleware/errorHandler');


dotenv.config();

const app = express();

// Middlewares
app.use(logger); // Custom logger
app.use(express.json()); // JSON body parser

// Routes
app.use('/api/products', productRoutes);

// Unknown route handler
app.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

// Global error handler
app.use(errorHandler);


// Connect DB
connectDB();

// Routes
app.use("/products", require("./routes/productsroutes"));

// Default route (HOME Page)
app.get("/", (req, res) => {
    res.send("Hello World");
});


// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));