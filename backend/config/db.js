const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connectionConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    retryWrites: true,
    w: 'majority'
  };

  const attemptConnection = async () => {
    try {
      console.log(`\n📡 Attempting MongoDB connection (Attempt ${retries + 1}/${maxRetries})...`);
      
      let uri = process.env.MONGO_URI;
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
        console.log(`📍 USING IN-MEMORY MONGODB FOR LOCAL TESTING`);
      } catch (err) {
        console.log(`📍 URI: ${uri?.substring(0, 50)}...`);
      }

      const connection = await mongoose.connect(uri, connectionConfig);

      console.log('✅ ==========================================');
      console.log('✅ MongoDB Connected Successfully!');
      console.log(`✅ Database: ${connection.connection.name}`);
      console.log(`✅ Host: ${connection.connection.host}`);
      console.log('✅ ==========================================\n');

      // Test connection
      await mongoose.connection.db.admin().ping();
      console.log('✅ MongoDB ping successful\n');

      return true;
    } catch (error) {
      retries++;

      console.error(`❌ Connection Attempt ${retries} failed:`);
      console.error(`   Error: ${error.message}`);

      if (retries < maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, retries - 1), 10000);
        console.log(`⏳ Retrying in ${waitTime}ms...\n`);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return attemptConnection();
      } else {
        console.error(`\n❌ ==========================================`);
        console.error(`❌ Failed to connect to MongoDB after ${maxRetries} attempts`);
        console.error(`❌ Check your:.env file (MONGO_URI)`);
        console.error(`❌ MongoDB Atlas whitelist (IP address)`);
        console.error(`❌ Network connectivity`);
        console.error(`❌ Database credentials`);
        console.error(`❌ ==========================================\n`);
        
        return false;
      }
    }
  };

  return await attemptConnection();
};

// Handle disconnection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB reconnected');
});

module.exports = connectDB;