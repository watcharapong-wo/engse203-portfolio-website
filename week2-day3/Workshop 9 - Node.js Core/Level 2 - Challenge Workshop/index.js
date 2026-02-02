// index.js
const taskManager = require('./modules/taskManager');
const logger = require('./modules/logger');
const { config, validateConfig } = require('./modules/config');

// Validate configuration
try {
  validateConfig();
} catch (error) {
  logger.error(error.message);
  process.exit(1);
}

// Show banner
function showBanner() {
  console.log('\n' + '='.repeat(60));
  console.log(` 📝 ${config.appName}`);
  console.log('='.repeat(60) + '\n');
}

// Show help
function showHelp() {
  console.log('Usage: node index.js <command> [arguments]\n');
  console.log('Commands:');
  console.log(' add <title> [priority] [--due YYYY-MM-DD] [--tag <tag>] - Add a new task');
  console.log(' list [filter] [--sort priority|date] [--overdue] [--tag <tag>] - List tasks');
  console.log(' search <keyword> - Search tasks by keyword');
  console.log(' complete <id> - Mark task as completed');
  console.log(' delete <id> - Delete a task');
  console.log(' update <id> <title> - Update task title');
  console.log(' stats - Show statistics');
  console.log(' export <filename> - Export tasks to JSON file');
  console.log(' import <filename> - Import tasks from JSON file');
  console.log(' help - Show this help\n');

  console.log('Examples:');
  console.log(' node index.js add "Buy groceries" high');
  console.log(' node index.js list pending');
  console.log(' node index.js complete 1');
  console.log(' node index.js search "Node"');
  console.log(' node index.js list --sort priority');
  console.log(' node index.js add "Meeting" high --due 2024-12-31');
  console.log(' node index.js list --overdue');
  console.log(' node index.js add "Code review" --tag work');
  console.log(' node index.js list --tag work');
  console.log(' node index.js search "Node"');
  console.log(' node index.js list --sort priority');
  console.log(' node index.js add "Meeting" high --due 2024-12-31');
  console.log(' node index.js list --overdue');
  console.log(' node index.js add "Code review" --tag work');
  console.log(' node index.js list --tag work');
}

function parseOptions(args) {
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--sort' && args[i + 1]) {
      options.sort = args[i + 1];
      i += 1;
    } else if (arg === '--due' && args[i + 1]) {
      options.dueDate = args[i + 1];
      i += 1;
    } else if (arg === '--tag' && args[i + 1]) {
      options.tag = args[i + 1];
      i += 1;
    } else if (arg === '--overdue') {
      options.overdue = true;
    }
  }
  return options;
}

// Main function
async function main() {
  showBanner();

  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'add':
        if (!args[1]) {
          logger.error('Please provide a task title');
          break;
        }
        {
          const tail = args.slice(2);
          let priority = 'medium';
          let optionArgs = tail;

          if (tail[0] && !tail[0].startsWith('--')) {
            priority = tail[0];
            optionArgs = tail.slice(1);
          }

          const options = parseOptions(optionArgs);
          await taskManager.addTask(args[1], priority, options);
        }
        break;
      case 'list':
        {
          let filter = 'all';
          let optionArgs = args.slice(1);

          if (args[1] && !args[1].startsWith('--')) {
            filter = args[1];
            optionArgs = args.slice(2);
          }

          const options = parseOptions(optionArgs);
          await taskManager.listTasks(filter, options);
        }
        break;
      case 'search':
        if (!args[1]) {
          logger.error('Please provide search keyword');
          break;
        }
        await taskManager.searchTasks(args[1]);
        break;
      case 'complete':
        if (!args[1]) {
          logger.error('Please provide task ID');
          break;
        }
        await taskManager.completeTask(parseInt(args[1], 10));
        break;
      case 'delete':
        if (!args[1]) {
          logger.error('Please provide task ID');
          break;
        }
        await taskManager.deleteTask(parseInt(args[1], 10));
        break;
      case 'update':
        if (!args[1] || !args[2]) {
          logger.error('Please provide task ID and new title');
          break;
        }
        await taskManager.updateTask(parseInt(args[1], 10), args[2]);
        break;
      case 'stats':
        await taskManager.showStats();
        break;
      case 'export':
        if (!args[1]) {
          logger.error('Please provide export filename');
          break;
        }
        await taskManager.exportTasks(args[1]);
        break;
      case 'import':
        if (!args[1]) {
          logger.error('Please provide import filename');
          break;
        }
        await taskManager.importTasks(args[1]);
        break;
      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
