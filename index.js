require('dotenv').config();

const { startServer } = require('./src/server');
const { sendCardByWebhook } = require('./src/feishu-api');
const { createFeedbackCard } = require('./src/card-templates');
const { markRecordCompleted } = require('./src/bitable-api');

startServer();

module.exports = {
  createFeedbackCard,
  sendCardByWebhook,
  markRecordCompleted
};
