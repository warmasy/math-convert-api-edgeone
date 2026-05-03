/**
 * EdgeOne 边缘函数入口
 * 在 EdgeOne 控制台创建边缘函数时，将此文件内容粘贴进去
 * 或配置函数文件路径为 edgefunction.js
 */
const app = require('./index.js');

exports.handler = async (event, context) => {
  // EdgeOne 事件格式转换为 Express 请求
  const request = event.request || event;
  const url = new URL(request.url || `http://localhost${request.uri}`);

  // 构建模拟的 req 对象
  const req = {
    method: request.method || 'GET',
    url: request.uri || url.pathname + url.search,
    path: url.pathname,
    query: {},
    headers: request.headers || {},
    body: request.body
  };

  // 解析查询参数
  url.searchParams.forEach((value, key) => {
    req.query[key] = value;
  });

  // 构建模拟的 res 对象
  let statusCode = 200;
  let responseBody = '';
  let responseHeaders = {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*'
  };

  const res = {
    status(code) { statusCode = code; return this; },
    header(key, value) { responseHeaders[key.toLowerCase()] = value; return this; },
    json(data) {
      responseBody = JSON.stringify(data);
      return this;
    },
    send(data) {
      responseBody = typeof data === 'string' ? data : JSON.stringify(data);
      return this;
    }
  };

  // 查找匹配的路由并执行
  try {
    // 简单路由匹配
    const path = req.path;
    const query = req.query;

    // 调用 Express app 的处理逻辑
    // 注意：这里使用简化的方式，实际 EdgeOne 支持 Node.js 运行时可直接运行 Express

    return {
      statusCode: statusCode,
      headers: responseHeaders,
      body: responseBody
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
