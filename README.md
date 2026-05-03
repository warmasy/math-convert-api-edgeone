# EdgeOne Math API

数学计算与单位转换 API 服务，支持直接部署到腾讯云 EdgeOne。

## 📦 项目结构

```
edgeone-math-api/
├── index.js              # 主入口文件（Express 应用）
├── edgefunction.js       # EdgeOne 边缘函数入口（备用）
├── edgeone-adapter.js    # EdgeOne 适配器（标准方式）
├── package.json          # 项目配置
├── .gitignore           # Git 忽略文件
└── README.md            # 本文件
```

## 🚀 快速开始（本地测试）

### 1. 安装依赖
```bash
npm install
```

### 2. 启动服务器
```bash
npm start
```

服务器将在 `http://localhost:3000` 启动。

### 3. 测试接口
打开浏览器访问：
- `http://localhost:3000/` - 查看所有可用接口
- `http://localhost:3000/api/add?a=10&b=5` - 测试加法
- `http://localhost:3000/api/convert/length?value=1&from=m&to=cm` - 测试长度转换

## ☁️ 部署到 EdgeOne

### 方式一：EdgeOne Pages（推荐，最简单）

EdgeOne Pages 支持直接部署 Node.js 项目：

1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 进入 **Pages** 服务
3. 点击 **创建项目**
4. 上传本项目的 ZIP 压缩包，或连接 Git 仓库
5. 构建命令留空（或填写 `npm install`）
6. 输出目录留空
7. 环境变量：添加 `NODE_ENV=production`
8. 点击部署

### 方式二：EdgeOne 边缘函数

1. 登录 [EdgeOne 控制台](https://console.cloud.tencent.com/edgeone)
2. 进入 **边缘函数**
3. 点击 **创建函数**
4. 函数名称：`math-api`
5. 运行时：**Node.js 16.x 或更高**
6. 将 `index.js` 的内容粘贴到编辑器中（或上传所有文件）
7. 触发规则：添加规则，匹配路径 `/api/*` 和 `/`
8. 保存并发布

### 方式三：EdgeOne 边缘函数（使用适配器）

如果方式二无法直接运行 Express，可以使用适配器：

1. 创建边缘函数时，入口文件选择 `edgeone-adapter.js`
2. 确保 `index.js` 和 `edgeone-adapter.js` 都已上传
3. 配置触发规则匹配 `/api/*`

## 📡 API 接口列表

### 数学计算

| 接口 | 示例 | 说明 |
|------|------|------|
| `GET /api/add` | `?a=10&b=5` | 加法 |
| `GET /api/subtract` | `?a=10&b=5` | 减法 |
| `GET /api/multiply` | `?a=10&b=5` | 乘法 |
| `GET /api/divide` | `?a=10&b=5` | 除法 |
| `GET /api/power` | `?base=2&exponent=3` | 幂运算 |
| `GET /api/sqrt` | `?num=16` | 平方根 |
| `GET /api/factorial` | `?n=5` | 阶乘 |
| `GET /api/abs` | `?num=-5` | 绝对值 |
| `GET /api/round` | `?num=3.7` | 四舍五入 |
| `GET /api/log` | `?num=100&base=10` | 对数（默认自然对数） |
| `GET /api/trig` | `?func=sin&angle=30&unit=deg` | 三角函数 |
| `GET /api/gcd` | `?a=48&b=18` | 最大公约数 |
| `GET /api/lcm` | `?a=4&b=6` | 最小公倍数 |
| `GET /api/percent` | `?value=50&total=200` | 百分比 |
| `GET /api/average` | `?nums=1,2,3,4,5` | 平均值 |
| `GET /api/sum` | `?nums=1,2,3,4,5` | 求和 |
| `GET /api/permutation` | `?n=5&r=3` | 排列数 |
| `GET /api/combination` | `?n=5&r=3` | 组合数 |

### 单位转换

| 接口 | 示例 | 说明 |
|------|------|------|
| `GET /api/convert/length` | `?value=1&from=m&to=cm` | 长度 |
| `GET /api/convert/weight` | `?value=1&from=kg&to=g` | 质量 |
| `GET /api/convert/temperature` | `?value=100&from=c&to=f` | 温度 |
| `GET /api/convert/area` | `?value=1&from=m2&to=cm2` | 面积 |
| `GET /api/convert/volume` | `?value=1&from=l&to=ml` | 体积 |
| `GET /api/convert/pressure` | `?value=1&from=pa&to=kpa` | 压力 |
| `GET /api/convert/speed` | `?value=1&from=mps&to=kph` | 速度 |
| `GET /api/convert/angle` | `?value=180&from=deg&to=rad` | 角度 |
| `GET /api/convert/force` | `?value=1&from=n&to=kn` | 力 |
| `GET /api/convert/energy` | `?value=1&from=j&to=cal` | 能量 |
| `GET /api/convert/power` | `?value=1&from=w&to=kw` | 功率 |
| `GET /api/convert/time` | `?value=1&from=h&to=min` | 时间 |
| `GET /api/convert/data` | `?value=1&from=gb&to=mb` | 数据存储 |

## 📋 返回格式

所有接口返回统一的 JSON 格式：

```json
{
  "operation": "add",
  "a": 10,
  "b": 5,
  "result": 15
}
```

错误时返回：

```json
{
  "error": "参数 a 和 b 必须是数字"
}
```

## 🔧 技术栈

- **Node.js** - 运行时
- **Express** - Web 框架
- **EdgeOne** - 边缘部署平台

## 📄 许可证

MIT
