const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const dotenv = require('dotenv');
const sendEmail = require('./utils/email');

dotenv.config();

const app = express();

//database
connectDB();

// CORS
app.use(cors({
  origin: ['http://localhost:5174','http://localhost:5173','http://localhost:5172'], 
  credentials: true, 
}));


//Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));