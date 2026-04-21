const express      = require('express');
const dotenv       = require('dotenv');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const helmet       = require('helmet');
const morgan       = require('morgan');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/claims',   require('./routes/claims'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/policies', require('./routes/policies'));
app.use('/api/fraud',    require('./routes/fraud'));
app.use('/api/users',    require('./routes/users'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server chal raha hai!', time: new Date() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});