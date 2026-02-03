require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    const server = app.listen(PORT, HOST, () => {
      console.log(`
╔════════════════════════════════════════╗
║          Blog API - Level 2            ║
╚════════════════════════════════════════╝

🚀 Server running at: http://${HOST}:${PORT}
📊 Database: ${process.env.MONGODB_URI?.split('/').pop()?.split('?')[0]}
🔧 Environment: ${process.env.NODE_ENV || 'development'}

📚 API Endpoints:
  - Health:      http://${HOST}:${PORT}/api/health
  - Auth:        http://${HOST}:${PORT}/api/auth
  - Users:       http://${HOST}:${PORT}/api/users
  - Categories:  http://${HOST}:${PORT}/api/categories
  - Posts:       http://${HOST}:${PORT}/api/posts
  - Comments:    http://${HOST}:${PORT}/api/comments

Press Ctrl+C to stop the server
      `);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n📦 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
      });
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
