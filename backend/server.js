import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import problemStatementRoutes from './routes/problemStatements.js';
import submissionRoutes from './routes/submissions.js';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problem-statements', problemStatementRoutes);
app.use('/api/submissions', submissionRoutes);

// Add default admin if doesn't exist
const seedAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
      await Admin.create({
        username: 'admin',
        password: 'password123',
      });
      console.log('✅ Default admin seeded: username: admin, password: password123');
    } else {
      console.log('ℹ️ Admin user already exists in database');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Database connection & Server Start
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    // Log masked URI for debugging (masking password while keeping user and host)
    const maskedUri = mongoUri.replace(/\/\/(.*):(.*)@/, (match, user, pass) => `//${user}:****@`);
    console.log(`📡 Connection Attempt: ${maskedUri}`);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Faster timeout for debugging
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Seed Admin
    await seedAdmin();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR DETAILS:');
    console.error(`- Message: ${error.message}`);
    console.error(`- Stack: ${error.stack}`);
    
    // Keep alive long enough for logs to flush
    console.log('--- Server will exit in 10 seconds ---');
    setTimeout(() => process.exit(1), 10000); 
  }
};

startServer();
