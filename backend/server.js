require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/auth');

const app = express();

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ DATABASE CONNECTION ============
connectDB();

// ============ HEALTH CHECK ROUTES ============
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is working 🚀',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health check passed ✅',
    uptime: process.uptime()
  });
});

// ============ API ROUTES ============
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found ❌',
    path: req.path
  });
});

// ============ ERROR HANDLING MIDDLEWARE ============
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============ SERVER START ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n✅ ==========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('✅ ==========================================\n');
});

// ============ GRACEFUL SHUTDOWN ============
process.on('SIGTERM', () => {
  console.log('📌 SIGTERM received. Shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📌 SIGINT received. Shutting down...');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});