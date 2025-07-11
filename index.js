const app = require('./app');
const fs = require('fs').promises;
const { config } = require('./config');
const { setupMessengerProfile } = require('./services/facebook.service');
const { chatHistory } = require('./services/chat.service');

const PORT = config.PORT;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Facebook Chatbot server is running on port ${PORT}`);
  console.log(`📝 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`💊 Health check: http://localhost:${PORT}/health`);
  
  if (config.FACEBOOK_PAGE_ACCESS_TOKEN) {
    await setupMessengerProfile();
  } else {
    console.warn('⚠️ FACEBOOK_PAGE_ACCESS_TOKEN is not set. Skipping Messenger Profile setup.');
  }
});

const gracefulShutdown = async () => {
  console.log('\n📄 SIGINT received. Shutting down gracefully...');
  console.log('Saving chat history before shutdown...');

  try {
    await fs.mkdir('./tmp', { recursive: true });
    const historyObject = Object.fromEntries(chatHistory);
    await fs.writeFile('./tmp/chat_history_backup.json', JSON.stringify(historyObject, null, 2));
    console.log('💾 Chat history saved successfully to ./tmp/chat_history_backup.json');
  } catch (error) {
    console.error('❌ Error saving chat history:', error);
  }

  server.close(() => {
    console.log('✅ Server has been closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);