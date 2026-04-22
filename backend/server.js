// Yeh file poore backend ka darwaza hai
// Yahan se saare routes connect hote hain

const express      = require('express');
const dotenv       = require('dotenv');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const helmet       = require('helmet');
const morgan       = require('morgan');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// .env file load karo
dotenv.config();

// Database se connect karo
connectDB();

const app = express();

// Security headers
app.use(helmet());

// Logs dikhao terminal mein
app.use(morgan('dev'));

// Frontend se requests aane do (CORS)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,   // cookies bhejne ke liye zaroori
}));

// JSON body parse karo
app.use(express.json());

// Cookies parse karo
app.use(cookieParser());

// Saare routes yahan connect hote hain
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/claims',   require('./routes/claims'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/policies', require('./routes/policies'));
app.use('/api/fraud',    require('./routes/fraud'));
app.use('/api/users',    require('./routes/users'));

// Health check — browser mein localhost:5000/api/health kholo
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server chal raha hai!', time: new Date() });
});

// Error handler — sabse last mein
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});