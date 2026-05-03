# EdgeOne 边缘函数部署指南

## 一、什么是 EdgeOne 边缘函数？

EdgeOne 边缘函数是一种 **Serverless（无服务器）** 计算方式：
- 不需要买服务器
- 不需要运行 `node app.js` 保持进程
- 不需要配置端口、防火墙
- 代码部署后，每次有请求自动触发执行
- 按请求次数计费，没有请求不花钱

**与传统 Node.js 服务器的区别：**

| 对比项 | 传统 Node.js (Express) | EdgeOne 边缘函数 |
|--------|----------------------|-----------------|
| 运行方式 | 持续运行的进程 | 请求触发，执行完即销毁 |
| 入口函数 | `app.listen(3000)` | `export default { async fetch(request) {} }` |
| 路由方式 | Express Router | 手动 `if/else` 判断 `request.url` |
| 请求体获取 | `req.body` | `await request.json()` |
| 响应返回 | `res.json({})` | `return new Response(JSON.stringify({}))` |
| 部署方式 | 上传代码 + 启动服务 | 上传单文件即可 |
| 费用 | 服务器一直计费 | 按请求次数计费 |

---

## 二、部署步骤

### 步骤 1：登录腾讯云 EdgeOne 控制台

1. 访问 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 如果没有账号，先注册腾讯云账号

### 步骤 2：创建边缘函数

1. 进入 **边缘函数** 页面
2. 点击 **新建函数**
3. 填写函数名称，如 `math-convert-api`
4. 运行时选择：**JavaScript**

### 步骤 3：粘贴代码

1. 打开本项目的 `index.js` 文件
2. 复制全部代码
3. 粘贴到 EdgeOne 控制台的代码编辑器中
4. **注意**：EdgeOne 边缘函数使用 ES Module 格式（`export default`），直接粘贴即可

### 步骤 4：配置触发规则（关键！）

边缘函数需要配置**触发规则**才能被访问：

1. 在函数页面，找到 **触发配置** 或 **规则引擎**
2. 添加规则：
   - **匹配条件**：URL Path 匹配 `/api/*` 或全部匹配 `*`
   - **执行动作**：执行边缘函数 `math-convert-api`
3. 如果你有自定义域名，绑定到 EdgeOne 站点

### 步骤 5：测试访问

部署完成后，你会得到一个访问地址，类似：
```
https://your-domain.com/api/math/operations
https://your-domain.com/api/math/calculate?op=add&a=10&b=20
```

直接在浏览器中访问即可测试。

---

## 三、常见问题

### Q1：部署后访问显示 404？

**原因**：触发规则没有配置正确，请求没有走到边缘函数。

**解决**：
1. 检查触发规则是否匹配了正确的 URL 路径
2. 确认边缘函数已绑定到站点
3. 等待 1-2 分钟让配置生效（边缘节点有缓存）

### Q2：POST 请求报错？

**原因**：可能是请求体格式不对，或者 Content-Type 头没设置。

**解决**：
- 确保请求头包含 `Content-Type: application/json`
- 确保请求体是合法的 JSON 格式

### Q3：如何更新代码？

直接到 EdgeOne 控制台编辑代码，保存后自动生效，不需要重启。

### Q4：如何绑定自己的域名？

1. 在 EdgeOne 控制台添加站点（输入你的域名）
2. 按照指引修改 DNS 解析，指向 EdgeOne
3. 在站点下创建边缘函数并配置触发规则

---

## 四、本地测试（可选）

虽然边缘函数是云端运行的，但你可以用以下方式本地验证逻辑：

```bash
# 安装 wrangler（Cloudflare Workers CLI，EdgeOne 兼容类似格式）
npm install -g wrangler

# 本地运行（需要适配 wrangler.toml 配置）
# 或者直接用 Node.js 测试纯函数逻辑
node -e "
import('./index.js').then(m => {
  const req = new Request('http://localhost/api/math/calculate?op=add&a=10&b=20');
  m.default.fetch(req).then(r => r.json()).then(console.log);
});
"
```

**更简单的方式**：直接部署到 EdgeOne 后在线测试，因为边缘函数没有本地服务器概念。

---

## 五、费用说明

EdgeOne 边缘函数通常有**免费额度**：
- 每月前 100 万次请求免费（具体以腾讯云最新政策为准）
- 对于个人学习和小项目完全够用
- 超出后按请求次数计费，非常便宜

---

## 六、与传统项目的对比总结

如果你之前用过 Express 版本，迁移到 EdgeOne 需要注意：

| 原 Express 代码 | EdgeOne 边缘函数代码 |
|----------------|---------------------|
| `const app = express()` | 删除，不需要 |
| `app.use(express.json())` | 删除，用 `await request.json()` |
| `app.get('/api/math/add', ...)` | `if (path === '/api/math/add' && method === 'GET')` |
| `req.query` | `url.searchParams` |
| `req.body` | `await request.json()` |
| `res.json({ result })` | `return new Response(JSON.stringify({ result }), { headers })` |
| `app.listen(3000)` | 删除，不需要 |

本项目已经帮你完成了所有改造，直接复制 `index.js` 部署即可！
