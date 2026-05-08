const express = require('express');
const config = require('./config');
const { createFeedbackCard } = require('./card-templates');
const { updateCard, getTenantToken } = require('./feishu-api');
const { markRecordCompleted, getRecord } = require('./bitable-api');

const app = express();
app.use(express.json());

/**
 * 飞书卡片回调处理
 */
app.post('/webhook/card', async (req, res) => {
  console.log('收到回调请求:', JSON.stringify(req.body, null, 2));

  const { header, event, challenge, type } = req.body;

  // 飞书 URL 验证（兼容多种格式）
  if (challenge || (header && header.event_type === 'url_verification') || type === 'url_verification') {
    console.log('URL 验证请求，返回 challenge:', challenge);
    return res.json({ challenge });
  }

  // 卡片按钮点击事件
  if (header && header.event_type === 'card.action.trigger') {
    const { action, open_message_id, operator } = event;

    if (action.value && action.value.action === 'complete_task') {
      const recordId = action.value.record_id;

      try {
        // 更新多维表状态
        await markRecordCompleted(recordId, operator.open_id);
        console.log('多维表更新成功:', recordId);

        // 获取记录详情用于更新卡片
        const recordRes = await getRecord(recordId);
        const record = recordRes.data.record;
        console.log('记录详情:', JSON.stringify(record.fields, null, 2));

        // 更新卡片为已完成状态（使用原卡片数据，不依赖字段名）
        const updatedCard = {
          config: {
            wide_screen_mode: true
          },
          header: {
            template: 'green',
            title: {
              content: `任务已完成`,
              tag: 'plain_text'
            }
          },
          elements: [
            {
              tag: 'div',
              text: {
                content: `**操作人：** ${operator.name || operator.open_id}`,
                tag: 'lark_md'
              }
            },
            {
              tag: 'div',
              text: {
                content: `**完成时间：** ${new Date().toLocaleString('zh-CN')}`,
                tag: 'lark_md'
              }
            },
            {
              tag: 'note',
              elements: [
                {
                  tag: 'plain_text',
                  content: '来自 值班-问题记录表'
                }
              ]
            }
          ]
        };

        await updateCard(open_message_id, updatedCard);
        console.log('卡片更新成功');

        return res.json({ result: 'success' });
      } catch (error) {
        console.error('处理任务完成失败:', error.response?.data || error.message);
        return res.status(500).json({ error: error.message });
      }
    }
  }

  res.json({ message: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

function startServer() {
  app.listen(config.server.port, () => {
    console.log(`服务器运行在 http://localhost:${config.server.port}`);
    console.log(`卡片回调地址: http://localhost:${config.server.port}/webhook/card`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
