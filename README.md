# Math & Convert API — EdgeOne 边缘函数版

基于 EdgeOne 边缘函数的数学计算与单位转换 API，无需服务器，部署即用。

## 与传统 Node.js 的区别

| 特性 | 传统 Express | EdgeOne 边缘函数 |
|------|-------------|-----------------|
| 运行方式 | 持续进程 | 请求触发 |
| 部署 | 买服务器 + 上传代码 + 启动 | 控制台粘贴代码即可 |
| 费用 | 服务器一直计费 | 按请求次数计费，有免费额度 |
| 代码量 | 多文件 + Express 框架 | 单文件，无框架依赖 |

## 部署步骤

1. 登录 [腾讯云 EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 创建边缘函数，运行时选择 **JavaScript**
3. 将 `index.js` 全部代码粘贴到编辑器
4. 配置触发规则（匹配 URL 路径 `/api/*` 或 `*`）
5. 绑定域名（可选）
6. 测试访问

详细步骤请参考 **[EdgeOne部署指南](./EdgeOne部署指南.md)**

## API 接口

所有接口与原版完全一致，支持 GET 和 POST：

### 🟢 GET 接口（浏览器可直接访问）

| 接口 | 说明 | 示例 |
|------|------|------|
| `GET /` | 首页 | `/` |
| `GET /api/math/operations` | 运算列表 | `/api/math/operations` |
| `GET /api/math/calculate` | 通用计算 | `?op=add&a=10&b=20` |
| `GET /api/math/factorial` | 阶乘 | `?n=5` |
| `GET /api/math/fibonacci` | 斐波那契 | `?n=10` |
| `GET /api/math/sum` | 批量求和 | `?numbers=1,2,3,4,5` |
| `GET /api/math/prime` | 判断质数 | `?n=17` |
| `GET /api/convert/units` | 单位列表 | `/api/convert/units` |
| `GET /api/convert/length` | 长度转换 | `?value=1&from=m&to=cm` |
| `GET /api/convert/all` | 多单位转换 | `?value=1&from=m` |

### 🔵 POST 接口

| 接口 | 请求体 |
|------|--------|
| `POST /api/math/add` | `{ "a": 10, "b": 20 }` |
| `POST /api/math/divide` | `{ "a": 100, "b": 4 }` |
| `POST /api/convert/length` | `{ "value": 1, "from": "m", "to": "cm" }` |
| `POST /api/convert/temperature` | `{ "value": 100, "from": "C", "to": "F" }` |

## 测试工具

打开 `api-test.html`，在顶部输入你的 EdgeOne 域名即可测试所有接口。

## 项目文件

```
├── index.js                    ← 边缘函数主代码（单文件，直接粘贴到 EdgeOne）
├── api-test.html               ← 浏览器测试工具
├── EdgeOne部署指南.md          ← 详细部署教程
└── README.md                   ← 本文件
```
