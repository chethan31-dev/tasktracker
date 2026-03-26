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

// ============ HEALTH CHECK ROUTE ============
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Server is working',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Health check passed',
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
    message: 'Route not found',
    path: req.path
  });
});

// ============ ERROR HANDLING MIDDLEWARE ============
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============ SERVER STARTUP ============
const startServer = async () => {
  const basePort = parseInt(process.env.PORT || 5000, 10);
  let port = basePort;
  const maxAttempts = 10;
  let attempts = 0;

  const server = app.listen;
  const tryListen = () => {
    if (attempts >= maxAttempts) {
      console.error(`❌ Failed to find available port after ${maxAttempts} attempts`);
      process.exit(1);
    }

    const listener = app.listen(port, '0.0.0.0', () => {
      console.log('\n✅ ==========================================');
      console.log(`✅ Server started successfully!`);
      console.log(`✅ Listening on: http://localhost:${port}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ ==========================================\n`);
    });

    listener.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️  Port ${port} is in use, trying port ${port + 1}...`);
        port++;
        attempts++;
        listener.close();
        tryListen();
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
  };

  tryListen();
};

startServer();

// ============ GRACEFUL SHUTDOWN ============
process.on('SIGTERM', () => {
  console.log('📌 SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📌 SIGINT signal received: closing HTTP server');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
