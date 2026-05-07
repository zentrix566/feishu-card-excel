const config = require('./config');

/**
 * 飞书卡片模板生成器
 */

/**
 * 生成问题反馈卡片
 * @param {Object} data - 卡片数据
 * @param {string} data.feedbackUser - 反馈人员
 * @param {string} data.customerName - 客户名称
 * @param {string} data.customerProblem - 客户问题
 * @param {string} data.dutyUser - 值班人员
 * @param {Object} data.aiSolution - AI解决方案
 * @param {string} data.recordId - 记录ID（用于回调）
 * @param {string} data.detailUrl - 可选，自定义查看详情链接
 * @param {boolean} isCompleted - 是否已完成
 * @returns {Object} 卡片JSON
 */
function createFeedbackCard(data, isCompleted = false) {
  const detailUrl = data.detailUrl || buildDetailUrl(data.recordId);

  function buildDetailUrl(recordId) {
    if (config.bitable.detailBaseUrl) {
      return `${config.bitable.detailBaseUrl}?table=${config.bitable.tableId}`;
    }
    return `https://${config.feishu.domain}/base/${config.bitable.appToken}?table=${config.bitable.tableId}`;
  }
  const statusButton = isCompleted
    ? {
        tag: 'button',
        text: {
          tag: 'plain_text',
          content: '已完成'
        },
        type: 'primary',
        disabled: true
      }
    : {
        tag: 'button',
        text: {
          tag: 'plain_text',
          content: '待完成'
        },
        type: 'danger',
        value: {
          action: 'complete_task',
          record_id: data.recordId
        }
      };

  return {
    config: {
      wide_screen_mode: true
    },
    header: {
      template: 'purple',
      title: {
        content: `你的[值班问题单]已被创建，请查收~~`,
        tag: 'plain_text'
      }
    },
    elements: [
      {
        tag: 'div',
        fields: [
          {
            is_short: true,
            text: {
              content: `**反馈人员：**\n${data.feedbackUser}`,
              tag: 'lark_md'
            }
          },
          {
            is_short: true,
            text: {
              content: `**客户名称：**\n${data.customerName}`,
              tag: 'lark_md'
            }
          }
        ]
      },
      {
        tag: 'div',
        fields: [
          {
            is_short: false,
            text: {
              content: `**客户问题：**\n${data.customerProblem}`,
              tag: 'lark_md'
            }
          }
        ]
      },
      {
        tag: 'div',
        fields: [
          {
            is_short: true,
            text: {
              content: `**值班人员：**\n${data.dutyUser}`,
              tag: 'lark_md'
            }
          }
        ]
      },
      {
        tag: 'hr'
      },
      {
        tag: 'markdown',
        content: `**AI给出的解决方案：**\n\`\`\`json\n${JSON.stringify(data.aiSolution, null, 2)}\n\`\`\``
      },
      {
        tag: 'action',
        actions: [
          statusButton,
          {
            tag: 'button',
            text: {
              tag: 'plain_text',
              content: '查看详情'
            },
            type: 'default',
            url: detailUrl
          }
        ]
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
}

module.exports = {
  createFeedbackCard
};
