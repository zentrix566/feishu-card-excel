require('dotenv').config();

module.exports = {
  feishu: {
    appId: process.env.FEISHU_APP_ID,
    appSecret: process.env.FEISHU_APP_SECRET,
    webhookUrl: process.env.FEISHU_WEBHOOK_URL,
    chatId: process.env.FEISHU_CHAT_ID,
    domain: process.env.FEISHU_DOMAIN || 'bytedance.feishu.cn'
  },
  bitable: {
    appToken: process.env.BITABLE_APP_TOKEN,
    tableId: process.env.BITABLE_TABLE_ID,
    detailBaseUrl: process.env.BITABLE_DETAIL_BASE_URL,
    statusField: process.env.BITABLE_STATUS_FIELD || '处理状态',
    handlerField: process.env.BITABLE_HANDLER_FIELD || '处理人',
    completedValue: process.env.BITABLE_COMPLETED_VALUE || '已完成'
  },
  server: {
    port: process.env.PORT || 3000
  }
};
