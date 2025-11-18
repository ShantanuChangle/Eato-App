require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

//Added after Frontend code for connection
const cors = require('cors');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

// Middleware
app.use(express.json()); // parse JSON bodies
app.use(morgan('dev'));  // request logging in dev

//Added after Frontend code for connection
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Connect DB
connectDB();

// Routes
app.get('/', (req, res) => res.json({ status: 'ok', msg: 'API running' }));

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);

// error handler (custom)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
