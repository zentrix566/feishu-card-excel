require('dotenv').config();
const { sendCardByWebhook, sendCardToChat } = require('../src/feishu-api');
const { createFeedbackCard } = require('../src/card-templates');
const config = require('../src/config');

async function main() {
  const cardData = {
    feedbackUser: '@小曼',
    customerName: '泰康',
    customerProblem: '元素找不到',
    dutyUser: '@小曼 @小曼',
    aiSolution: {
      '最终问题类型': '需要人工判断',
      '裁决原因': '情绪催促',
      '最终流转': '区域值班技术'
    },
    recordId: 'recxxxxxx' // 替换为实际的记录ID
    // 可选：如果需要自定义详情链接，取消下面注释
    // detailUrl: 'https://自定义链接'
  };

  const card = createFeedbackCard(cardData, false);

  if (config.feishu.webhookUrl) {
    console.log('通过Webhook发送卡片...');
    const result = await sendCardByWebhook(card);
    console.log('发送结果:', result);
  } else {
    console.log('请配置 FEISHU_WEBHOOK_URL 或使用 sendCardToChat 方法');
  }
}

main().catch(console.error);
