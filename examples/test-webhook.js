require('dotenv').config();
const axios = require('axios');

const WEBHOOK_URL = 'https://phmzr1m5-3000.usw3.devtunnels.ms/webhook/card';

async function testUrlVerification() {
  console.log('测试 URL 验证请求...');

  try {
    const res = await axios.post(WEBHOOK_URL, {
      challenge: 'test_challenge_123',
      token: 'test_token',
      type: 'url_verification',
      header: {
        event_type: 'url_verification'
      }
    });

    console.log('✅ 验证成功!');
    console.log('返回:', res.data);

    if (res.data.challenge === 'test_challenge_123') {
      console.log('✅ challenge 匹配正确!');
    } else {
      console.log('❌ challenge 不匹配!');
    }
  } catch (error) {
    console.log('❌ 验证失败!');
    console.log('状态码:', error.response?.status);
    console.log('返回:', error.response?.data || error.message);
  }
}

async function testCardAction() {
  console.log('\n测试卡片动作回调...');

  try {
    const res = await axios.post(WEBHOOK_URL, {
      header: {
        event_type: 'card.action.trigger'
      },
      event: {
        action: {
          value: {
            action: 'complete_task',
            record_id: 'rec_test_123'
          }
        },
        open_message_id: 'om_test_123',
        operator: {
          open_id: 'ou_test_123',
          name: '测试用户'
        }
      }
    });

    console.log('✅ 请求成功!');
    console.log('返回:', res.data);
  } catch (error) {
    console.log('❌ 请求失败!');
    console.log('状态码:', error.response?.status);
    console.log('返回:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('测试回调地址:', WEBHOOK_URL);
  console.log('='.repeat(60));

  await testUrlVerification();
  await testCardAction();
}

main().catch(console.error);
