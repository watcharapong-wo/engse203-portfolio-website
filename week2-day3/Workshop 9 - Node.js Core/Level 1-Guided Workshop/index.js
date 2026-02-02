const fileManager = require('./modules/fileManager');
const logger = require('./modules/logger');
const { config, validateConfig } = require('./modules/config');

try {
  validateConfig();
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}

function showBanner() {
  console.log('\n' + '='.repeat(50));
  console.log(`  ${config.appName}`);
  console.log('='.repeat(50) + '\n');
}

function showHelp() {
  console.log('Usage: node index.js <command> [arguments]\n');
  console.log('Commands:');
  console.log('  list                        - List all files');
  console.log('  create <file> [content]     - Create a new file');
  console.log('  read <file>                 - Read file content');
  console.log('  delete <file>               - Delete a file');
  console.log('  mkdir <dir>                 - Create a directory');
  console.log('  copy <src> <dst>            - Copy a file');
  console.log('  help                        - Show this help\n');
}

async function main() {
  showBanner();

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'list':
        await fileManager.listFiles();
        break;

      case 'create': {
        if (!args[1]) return logger.error('Please provide a filename');
        const content = args.slice(2).join(' ') || 'Hello from File Manager!';
        await fileManager.createFile(args[1], content);
        break;
      }

      case 'read':
        if (!args[1]) return logger.error('Please provide a filename');
        await fileManager.readFile(args[1]);
        break;

      case 'delete':
        if (!args[1]) return logger.error('Please provide a filename');
        await fileManager.deleteFile(args[1]);
        break;

      case 'mkdir':
        if (!args[1]) return logger.error('Please provide a directory name');
        await fileManager.createDirectory(args[1]);
        break;

      case 'copy':
        if (!args[1] || !args[2]) return logger.error('Please provide source and destination files');
        await fileManager.copyFile(args[1], args[2]);
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    logger.error(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

main();
