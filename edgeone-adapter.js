/**
 * EdgeOne 边缘函数适配器 - 标准方式
 * 
 * EdgeOne 边缘函数支持标准的 Node.js HTTP 处理，
 * 可以直接使用 Express app 作为处理函数。
 * 
 * 部署步骤：
 * 1. 在 EdgeOne 控制台进入"边缘函数"
 * 2. 创建新函数，选择 Node.js 运行时
 * 3. 将所有项目文件上传（或使用 CLI 部署）
 * 4. 触发规则配置为匹配你的 API 路径，如 /api/*
 * 5. 保存并发布
 */

const app = require('./index.js');

// EdgeOne 边缘函数标准入口
exports.main = async (event, context) => {
  // 将 EdgeOne 请求转换为 Node.js 的 req/res 格式
  const http = require('http');
  const URL = require('url');

  return new Promise((resolve, reject) => {
    const req = new http.IncomingMessage(null);
    const res = new http.ServerResponse(req);

    // 设置请求属性
    const request = event.request || event;
    const url = request.url || request.uri || '/';

    req.method = (request.method || 'GET').toUpperCase();
    req.url = url;
    req.headers = request.headers || {};

    // 收集响应
    let body = [];
    res.on('data', chunk => body.push(chunk));
    res.on('end', () => {
      const responseBody = Buffer.concat(body).toString();
      resolve({
        statusCode: res.statusCode || 200,
        headers: res.getHeaders(),
        body: responseBody
      });
    });

    // 调用 Express app
    app(req, res);
  });
};

// 兼容不同版本的 EdgeOne 运行时
exports.handler = exports.main;
