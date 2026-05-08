require('dotenv').config();
const { sendCardByWebhook, sendCardToChat } = require('../src/feishu-api');
const { createFeedbackCard } = require('../src/card-templates');
const config = require('../src/config');

async function main() {
  const cardData = {
    feedbackUser: '@测试用户',
    customerName: '测试客户',
    customerProblem: '测试问题描述',
    dutyUser: '@处理人',
    aiSolution: {
      '最终问题类型': '需要人工判断',
      '裁决原因': '情绪催促',
      '最终流转': '区域值班技术'
    },
    recordId: 'recxxxxxx' // 替换为实际的记录ID
    // 可选：如果需要自定义详情链接，取消下面注释
    // detailUrl: config.bitable.detailBaseUrl
  };

  const card = createFeedbackCard(cardData, false);

  // ============================================================
  // 方案1：通过应用直接发送到群聊（推荐，无频率限制）✅
  // ============================================================
  if (config.feishu.chatId) {
    console.log('通过应用发送卡片到群聊:', config.feishu.chatId);
    try {
      const result = await sendCardToChat(config.feishu.chatId, card);
      console.log('发送结果:', JSON.stringify(result, null, 2));

      if (result.code === 0) {
        console.log('✅ 发送成功! 消息ID:', result.data.message_id);
      } else {
        console.log('❌ 发送失败:', result.msg);
      }
    } catch (error) {
      console.error('发送出错:', error.response?.data || error.message);
    }
    return;
  }

  // ============================================================
  // 方案2：通过Webhook发送（有频率限制，仅用于测试）
  // ============================================================
  if (config.feishu.webhookUrl) {
    console.log('通过Webhook发送卡片...');
    const result = await sendCardByWebhook(card);
    console.log('发送结果:', result);
  } else {
    console.log('请在 .env 中配置 FEISHU_CHAT_ID 或 FEISHU_WEBHOOK_URL');
  }
}

main().catch(console.error);
