const axios = require('axios');
const config = require('./config');
const { getTenantToken } = require('./feishu-api');

/**
 * 更新多维表记录状态为已完成
 * @param {string} recordId - 记录ID
 * @param {string} handlerUserId - 处理人用户ID
 */
async function markRecordCompleted(recordId, handlerUserId) {
  const token = await getTenantToken();

  const fields = {
    [config.bitable.statusField]: config.bitable.completedValue
  };

  if (handlerUserId) {
    fields[config.bitable.handlerField] = {
      id: handlerUserId
    };
  }

  const res = await axios({
    method: 'PATCH',
    url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${config.bitable.appToken}/tables/${config.bitable.tableId}/records/${recordId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: {
      fields
    }
  });

  return res.data;
}

/**
 * 获取多维表记录详情
 * @param {string} recordId - 记录ID
 */
async function getRecord(recordId) {
  const token = await getTenantToken();
  const res = await axios({
    method: 'GET',
    url: `https://open.feishu.cn/open-apis/bitable/v1/apps/${config.bitable.appToken}/tables/${config.bitable.tableId}/records/${recordId}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

module.exports = {
  markRecordCompleted,
  getRecord
};
