# 飞书卡片与多维表集成

实现飞书卡片通知，支持按钮点击更新多维表状态。

## 功能特性

1. **卡片通知** - 将问题反馈以卡片形式发送到群聊
2. **待完成按钮** - 卡片中红色"待完成"操作按钮
3. **状态变更** - 点击按钮后变为绿色"已完成"（置灰）
4. **多维表更新** - 自动更新对应记录状态为"已完成"
5. **处理人赋值** - 自动将点击按钮的人设为处理人

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env`：

```env
# 飞书应用配置
FEISHU_APP_ID=cli_xxxxxxxxxx
FEISHU_APP_SECRET=xxxxxxxxxx

# 飞书群聊机器人Webhook
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxxxx

# 多维表配置
BITABLE_APP_TOKEN=xxxxxxxxxx
BITABLE_TABLE_ID=tblxxxxxxxxxx

# 服务器端口
PORT=3000
```

### 3. 启动服务

```bash
npm start
```

### 4. 配置飞书卡片回调

在飞书开发者后台，将"卡片交互回调"地址配置为：

```
https://你的域名/webhook/card
```

### 5. 测试发送卡片

```bash
npm run send-card
```

## 项目结构

```
├── src/
│   ├── config.js          # 配置文件
│   ├── card-templates.js  # 卡片模板生成
│   ├── feishu-api.js      # 飞书API封装
│   ├── bitable-api.js     # 多维表API
│   └── server.js          # Express服务器
├── examples/
│   └── send-card.js       # 发送卡片示例
├── index.js               # 入口文件
├── .env.example           # 环境变量示例
└── package.json
```

## 飞书应用权限配置

需要在飞书开发者后台开通以下权限：

- `im:message` - 发送消息
- `im:message:send_as_bot` - 以机器人身份发送消息
- `bitable:app` - 访问多维表
- `bitable:record:write` - 写入多维表记录

## 卡片字段说明

| 字段 | 说明 |
|------|------|
| 反馈人员 | 提交问题的CSM人员 |
| 客户名称 | 客户名称 |
| 客户问题 | 具体问题描述 |
| 值班人员 | 值班对接人员 |
| AI解决方案 | AI给出的解决方案JSON |
| 待完成按钮 | 点击标记完成 |
| 查看详情按钮 | 跳转到多维表记录 |

## API说明

### 创建卡片

```javascript
const { createFeedbackCard } = require('./src/card-templates');

const card = createFeedbackCard({
  feedbackUser: '@小曼',
  customerName: '客户名',
  customerProblem: '问题描述',
  dutyUser: '@值班人',
  aiSolution: { ... },
  recordId: 'recxxxxxx'
}, false);
```

### 发送卡片

```javascript
const { sendCardByWebhook } = require('./src/feishu-api');
await sendCardByWebhook(card);
```

### 更新多维表记录

```javascript
const { markRecordCompleted } = require('./src/bitable-api');
await markRecordCompleted(recordId, handlerUserId);
```
