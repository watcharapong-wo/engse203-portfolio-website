require('dotenv').config();
const app = require('./src/app');
const dbManager = require('./src/db');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

let server;

async function startServer() {
  try {
    // Connect to database
    await dbManager.connect();
    await dbManager.createSchema();
    await dbManager.seedData();

    // Start Express server
    server = app.listen(PORT, HOST, () => {
      console.log(`
╔════════════════════════════════════════╗
║   Product Management API - Level 2     ║
╚════════════════════════════════════════╝

🚀 Server running at: http://${HOST}:${PORT}
📊 Database: ${process.env.DB_PATH || './database/database.db'}
🔧 Environment: ${process.env.NODE_ENV || 'development'}

📚 API Endpoints:
  - Products:    http://${HOST}:${PORT}/api/products
  - Categories:  http://${HOST}:${PORT}/api/categories
  - Health:      http://${HOST}:${PORT}/api/health

Press Ctrl+C to stop the server
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('\n📦 Shutting down gracefully...');

  if (server) {
    server.close(() => {
      console.log('✅ Server closed');
    });
  }

  await dbManager.close();
  process.exit(0);
});

// Start the server
startServer();
