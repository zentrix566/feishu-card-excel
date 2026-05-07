const lark = require('@larksuiteoapi/node-sdk');
const axios = require('axios');
const config = require('./config');

const client = new lark.Client({
  appId: config.feishu.appId,
  appSecret: config.feishu.appSecret,
  appType: lark.AppType.SelfBuild,
  domain: lark.Domain.Lark
});

/**
 * 获取tenant_access_token
 */
async function getTenantToken() {
  const res = await client.auth.tenantAccessToken.internal({
    data: {
      app_id: config.feishu.appId,
      app_secret: config.feishu.appSecret
    }
  });
  return res.tenant_access_token;
}

/**
 * 发送卡片消息到群聊
 * @param {string} chatId - 群聊ID
 * @param {Object} card - 卡片内容
 */
async function sendCardToChat(chatId, card) {
  const token = await getTenantToken();
  const res = await axios({
    method: 'POST',
    url: 'https://open.feishu.cn/open-apis/im/v1/messages',
    params: {
      receive_id_type: 'chat_id'
    },
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      receive_id: chatId,
      msg_type: 'interactive',
      content: JSON.stringify(card)
    }
  });
  return res.data;
}

/**
 * 通过Webhook发送卡片消息
 * @param {Object} card - 卡片内容
 */
async function sendCardByWebhook(card) {
  const res = await axios({
    method: 'POST',
    url: config.feishu.webhookUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      msg_type: 'interactive',
      card: card
    }
  });
  return res.data;
}

/**
 * 更新卡片消息
 * @param {string} messageId - 消息ID
 * @param {Object} card - 新的卡片内容
 */
async function updateCard(messageId, card) {
  const token = await getTenantToken();
  const res = await axios({
    method: 'PATCH',
    url: `https://open.feishu.cn/open-apis/im/v1/messages/${messageId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      msg_type: 'interactive',
      content: JSON.stringify(card)
    }
  });
  return res.data;
}

module.exports = {
  client,
  getTenantToken,
  sendCardToChat,
  sendCardByWebhook,
  updateCard
};
