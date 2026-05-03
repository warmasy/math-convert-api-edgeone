const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// CORS 设置（EdgeOne 需要）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ==================== 数学计算 API ====================

// 1. 加法 /api/add?a=10&b=5
app.get('/api/add', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: '参数 a 和 b 必须是数字' });
  }
  res.json({ operation: 'add', a, b, result: a + b });
});

// 2. 减法 /api/subtract?a=10&b=5
app.get('/api/subtract', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: '参数 a 和 b 必须是数字' });
  }
  res.json({ operation: 'subtract', a, b, result: a - b });
});

// 3. 乘法 /api/multiply?a=10&b=5
app.get('/api/multiply', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: '参数 a 和 b 必须是数字' });
  }
  res.json({ operation: 'multiply', a, b, result: a * b });
});

// 4. 除法 /api/divide?a=10&b=5
app.get('/api/divide', (req, res) => {
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: '参数 a 和 b 必须是数字' });
  }
  if (b === 0) {
    return res.status(400).json({ error: '除数 b 不能为 0' });
  }
  res.json({ operation: 'divide', a, b, result: a / b });
});

// 5. 幂运算 /api/power?base=2&exponent=3
app.get('/api/power', (req, res) => {
  const base = parseFloat(req.query.base);
  const exponent = parseFloat(req.query.exponent);
  if (isNaN(base) || isNaN(exponent)) {
    return res.status(400).json({ error: '参数 base 和 exponent 必须是数字' });
  }
  res.json({ operation: 'power', base, exponent, result: Math.pow(base, exponent) });
});

// 6. 平方根 /api/sqrt?num=16
app.get('/api/sqrt', (req, res) => {
  const num = parseFloat(req.query.num);
  if (isNaN(num)) {
    return res.status(400).json({ error: '参数 num 必须是数字' });
  }
  if (num < 0) {
    return res.status(400).json({ error: 'num 不能为负数' });
  }
  res.json({ operation: 'sqrt', num, result: Math.sqrt(num) });
});

// 7. 阶乘 /api/factorial?n=5
app.get('/api/factorial', (req, res) => {
  const n = parseInt(req.query.n);
  if (isNaN(n) || n < 0 || !Number.isInteger(parseFloat(req.query.n))) {
    return res.status(400).json({ error: '参数 n 必须是非负整数' });
  }
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  res.json({ operation: 'factorial', n, result });
});

// 8. 取绝对值 /api/abs?num=-5
app.get('/api/abs', (req, res) => {
  const num = parseFloat(req.query.num);
  if (isNaN(num)) {
    return res.status(400).json({ error: '参数 num 必须是数字' });
  }
  res.json({ operation: 'abs', num, result: Math.abs(num) });
});

// 9. 取整 /api/round?num=3.7
app.get('/api/round', (req, res) => {
  const num = parseFloat(req.query.num);
  if (isNaN(num)) {
    return res.status(400).json({ error: '参数 num 必须是数字' });
  }
  res.json({ operation: 'round', num, result: Math.round(num) });
});

// 10. 对数 /api/log?num=100&base=10
app.get('/api/log', (req, res) => {
  const num = parseFloat(req.query.num);
  const base = req.query.base ? parseFloat(req.query.base) : Math.E;
  if (isNaN(num) || num <= 0) {
    return res.status(400).json({ error: '参数 num 必须是正数' });
  }
  if (isNaN(base) || base <= 0 || base === 1) {
    return res.status(400).json({ error: '参数 base 必须是大于0且不等于1的正数' });
  }
  const result = Math.log(num) / Math.log(base);
  res.json({ operation: 'log', num, base, result });
});

// 11. 三角函数 /api/trig?func=sin&angle=30&unit=deg
app.get('/api/trig', (req, res) => {
  const func = req.query.func?.toLowerCase();
  const angle = parseFloat(req.query.angle);
  const unit = req.query.unit?.toLowerCase() || 'deg';
  const validFuncs = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan'];

  if (!validFuncs.includes(func)) {
    return res.status(400).json({ error: `func 必须是以下之一: ${validFuncs.join(', ')}` });
  }
  if (isNaN(angle)) {
    return res.status(400).json({ error: '参数 angle 必须是数字' });
  }

  let rad = unit === 'deg' ? angle * Math.PI / 180 : angle;
  let result;
  switch(func) {
    case 'sin': result = Math.sin(rad); break;
    case 'cos': result = Math.cos(rad); break;
    case 'tan': result = Math.tan(rad); break;
    case 'asin': result = Math.asin(angle); rad = result; result = unit === 'deg' ? result * 180 / Math.PI : result; break;
    case 'acos': result = Math.acos(angle); rad = result; result = unit === 'deg' ? result * 180 / Math.PI : result; break;
    case 'atan': result = Math.atan(angle); rad = result; result = unit === 'deg' ? result * 180 / Math.PI : result; break;
  }

  res.json({ operation: 'trig', func, angle, unit, result });
});

// 12. 最大公约数 /api/gcd?a=48&b=18
app.get('/api/gcd', (req, res) => {
  let a = parseInt(req.query.a);
  let b = parseInt(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: '参数 a 和 b 必须是整数' });
  }
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) { [a, b] = [b, a % b]; }
  res.json({ operation: 'gcd', a: parseInt(req.query.a), b: parseInt(req.query.b), result: a });
});

// 13. 最小公倍数 /api/lcm?a=4&b=6
app.get('/api/lcm', (req, res) => {
  let a = parseInt(req.query.a);
  let b = parseInt(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ error: '参数 a 和 b 必须是整数' });
  }
  a = Math.abs(a); b = Math.abs(b);
  const gcd = (x, y) => { while(y !== 0) { [x, y] = [y, x % y]; } return x; };
  const result = (a * b) / gcd(a, b);
  res.json({ operation: 'lcm', a: parseInt(req.query.a), b: parseInt(req.query.b), result });
});

// 14. 百分比 /api/percent?value=50&total=200
app.get('/api/percent', (req, res) => {
  const value = parseFloat(req.query.value);
  const total = parseFloat(req.query.total);
  if (isNaN(value) || isNaN(total)) {
    return res.status(400).json({ error: '参数 value 和 total 必须是数字' });
  }
  if (total === 0) {
    return res.status(400).json({ error: 'total 不能为 0' });
  }
  res.json({ operation: 'percent', value, total, result: (value / total) * 100 });
});

// 15. 平均值 /api/average?nums=1,2,3,4,5
app.get('/api/average', (req, res) => {
  const numsStr = req.query.nums;
  if (!numsStr) {
    return res.status(400).json({ error: '参数 nums 必填，例如 nums=1,2,3' });
  }
  const nums = numsStr.split(',').map(Number).filter(n => !isNaN(n));
  if (nums.length === 0) {
    return res.status(400).json({ error: 'nums 中至少需要有一个有效数字' });
  }
  const sum = nums.reduce((a, b) => a + b, 0);
  res.json({ operation: 'average', nums, count: nums.length, sum, result: sum / nums.length });
});

// 16. 求和 /api/sum?nums=1,2,3,4,5
app.get('/api/sum', (req, res) => {
  const numsStr = req.query.nums;
  if (!numsStr) {
    return res.status(400).json({ error: '参数 nums 必填，例如 nums=1,2,3' });
  }
  const nums = numsStr.split(',').map(Number).filter(n => !isNaN(n));
  if (nums.length === 0) {
    return res.status(400).json({ error: 'nums 中至少需要有一个有效数字' });
  }
  const result = nums.reduce((a, b) => a + b, 0);
  res.json({ operation: 'sum', nums, count: nums.length, result });
});

// 17. 排列数 /api/permutation?n=5&r=3
app.get('/api/permutation', (req, res) => {
  const n = parseInt(req.query.n);
  const r = parseInt(req.query.r);
  if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
    return res.status(400).json({ error: '参数错误：n≥0, r≥0, r≤n' });
  }
  let result = 1;
  for (let i = 0; i < r; i++) result *= (n - i);
  res.json({ operation: 'permutation', n, r, result });
});

// 18. 组合数 /api/combination?n=5&r=3
app.get('/api/combination', (req, res) => {
  const n = parseInt(req.query.n);
  const r = parseInt(req.query.r);
  if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
    return res.status(400).json({ error: '参数错误：n≥0, r≥0, r≤n' });
  }
  const factorial = (x) => { let res = 1; for (let i = 2; i <= x; i++) res *= i; return res; };
  const result = factorial(n) / (factorial(r) * factorial(n - r));
  res.json({ operation: 'combination', n, r, result });
});

// ==================== 单位转换 API ====================

// 长度转换 /api/convert/length?value=1&from=m&to=cm
app.get('/api/convert/length', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    m: 1, km: 1000, cm: 0.01, mm: 0.001, um: 1e-6, nm: 1e-9,
    inch: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
    nmi: 1852, ly: 9.461e15
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'length', value, from, to, result });
});

// 质量转换 /api/convert/weight?value=1&from=kg&to=g
app.get('/api/convert/weight', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    kg: 1, g: 0.001, mg: 1e-6, t: 1000, lb: 0.453592, oz: 0.0283495,
    jin: 0.5, liang: 0.05
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'weight', value, from, to, result });
});

// 温度转换 /api/convert/temperature?value=100&from=c&to=f
app.get('/api/convert/temperature', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  let celsius;
  switch(from) {
    case 'c': celsius = value; break;
    case 'f': celsius = (value - 32) * 5/9; break;
    case 'k': celsius = value - 273.15; break;
    case 'r': celsius = (value - 491.67) * 5/9; break;
    default: return res.status(400).json({ error: 'from 支持: c(摄氏), f(华氏), k(开尔文), r(兰金)' });
  }
  let result;
  switch(to) {
    case 'c': result = celsius; break;
    case 'f': result = celsius * 9/5 + 32; break;
    case 'k': result = celsius + 273.15; break;
    case 'r': result = (celsius + 273.15) * 9/5; break;
    default: return res.status(400).json({ error: 'to 支持: c(摄氏), f(华氏), k(开尔文), r(兰金)' });
  }
  res.json({ type: 'temperature', value, from, to, result });
});

// 面积转换 /api/convert/area?value=1&from=m2&to=cm2
app.get('/api/convert/area', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    'm2': 1, 'km2': 1e6, 'cm2': 1e-4, 'mm2': 1e-6, 'ha': 10000,
    'acre': 4046.86, 'mu': 666.667, 'ft2': 0.092903, 'in2': 0.00064516
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'area', value, from, to, result });
});

// 体积转换 /api/convert/volume?value=1&from=l&to=ml
app.get('/api/convert/volume', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    'l': 1, 'ml': 0.001, 'm3': 1000, 'cm3': 0.001, 'gal': 3.78541,
    'qt': 0.946353, 'pt': 0.473176, 'cup': 0.24, 'floz': 0.0295735
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'volume', value, from, to, result });
});

// 压力转换 /api/convert/pressure?value=1&from=pa&to=kpa
app.get('/api/convert/pressure', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    pa: 1, kpa: 1000, mpa: 1e6, bar: 1e5, mbar: 100,
    atm: 101325, torr: 133.322, psi: 6894.76, mmhg: 133.322
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'pressure', value, from, to, result });
});

// 速度转换 /api/convert/speed?value=1&from=mps&to=kph
app.get('/api/convert/speed', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    'mps': 1, 'kph': 0.277778, 'mph': 0.44704, 'kn': 0.514444, 'mach': 340.3
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'speed', value, from, to, result });
});

// 角度转换 /api/convert/angle?value=180&from=deg&to=rad
app.get('/api/convert/angle', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  let deg;
  switch(from) {
    case 'deg': deg = value; break;
    case 'rad': deg = value * 180 / Math.PI; break;
    case 'grad': deg = value * 0.9; break;
    case 'min': deg = value / 60; break;
    case 'sec': deg = value / 3600; break;
    default: return res.status(400).json({ error: 'from 支持: deg, rad, grad, min, sec' });
  }
  let result;
  switch(to) {
    case 'deg': result = deg; break;
    case 'rad': result = deg * Math.PI / 180; break;
    case 'grad': result = deg / 0.9; break;
    case 'min': result = deg * 60; break;
    case 'sec': result = deg * 3600; break;
    default: return res.status(400).json({ error: 'to 支持: deg, rad, grad, min, sec' });
  }
  res.json({ type: 'angle', value, from, to, result });
});

// 力转换 /api/convert/force?value=1&from=n&to=kn
app.get('/api/convert/force', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    n: 1, kn: 1000, mn: 1e6, kgf: 9.80665, gf: 0.00980665, lbf: 4.44822, dyn: 1e-5
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'force', value, from, to, result });
});

// 能量转换 /api/convert/energy?value=1&from=j&to=cal
app.get('/api/convert/energy', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    j: 1, kj: 1000, mj: 1e6, cal: 4.184, kcal: 4184, wh: 3600, kwh: 3.6e6,
    ev: 1.602e-19, btu: 1055.06
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'energy', value, from, to, result });
});

// 功率转换 /api/convert/power?value=1&from=w&to=kw
app.get('/api/convert/power', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    w: 1, kw: 1000, mw: 1e6, hp: 745.7, ps: 735.5, btu_h: 0.293071
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'power', value, from, to, result });
});

// 时间转换 /api/convert/time?value=1&from=h&to=min
app.get('/api/convert/time', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    s: 1, min: 60, h: 3600, d: 86400, wk: 604800, mo: 2.628e6, y: 3.154e7,
    ms: 0.001, us: 1e-6, ns: 1e-9
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'time', value, from, to, result });
});

// 数据存储转换 /api/convert/data?value=1&from=gb&to=mb
app.get('/api/convert/data', (req, res) => {
  const value = parseFloat(req.query.value);
  const from = req.query.from?.toLowerCase();
  const to = req.query.to?.toLowerCase();
  if (isNaN(value)) return res.status(400).json({ error: 'value 必须是数字' });

  const units = {
    b: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776,
    pb: 1.126e15
  };
  if (!units[from] || !units[to]) {
    return res.status(400).json({ error: `支持的单位: ${Object.keys(units).join(', ')}` });
  }
  const result = value * units[from] / units[to];
  res.json({ type: 'data', value, from, to, result });
});

// ==================== 首页与测试页面 ====================

// API 首页 - 返回所有接口列表
app.get('/', (req, res) => {
  res.json({
    name: 'EdgeOne Math API',
    version: '1.0.0',
    description: '数学计算与单位转换 API 服务',
    endpoints: {
      math: [
        { path: '/api/add?a=10&b=5', desc: '加法' },
        { path: '/api/subtract?a=10&b=5', desc: '减法' },
        { path: '/api/multiply?a=10&b=5', desc: '乘法' },
        { path: '/api/divide?a=10&b=5', desc: '除法' },
        { path: '/api/power?base=2&exponent=3', desc: '幂运算' },
        { path: '/api/sqrt?num=16', desc: '平方根' },
        { path: '/api/factorial?n=5', desc: '阶乘' },
        { path: '/api/abs?num=-5', desc: '绝对值' },
        { path: '/api/round?num=3.7', desc: '四舍五入' },
        { path: '/api/log?num=100&base=10', desc: '对数运算' },
        { path: '/api/trig?func=sin&angle=30&unit=deg', desc: '三角函数 (sin/cos/tan/asin/acos/atan)' },
        { path: '/api/gcd?a=48&b=18', desc: '最大公约数' },
        { path: '/api/lcm?a=4&b=6', desc: '最小公倍数' },
        { path: '/api/percent?value=50&total=200', desc: '百分比计算' },
        { path: '/api/average?nums=1,2,3,4,5', desc: '平均值' },
        { path: '/api/sum?nums=1,2,3,4,5', desc: '求和' },
        { path: '/api/permutation?n=5&r=3', desc: '排列数 A(n,r)' },
        { path: '/api/combination?n=5&r=3', desc: '组合数 C(n,r)' }
      ],
      convert: [
        { path: '/api/convert/length?value=1&from=m&to=cm', desc: '长度转换 (m,km,cm,mm,inch,ft,yd,mi...)' },
        { path: '/api/convert/weight?value=1&from=kg&to=g', desc: '质量转换 (kg,g,mg,t,lb,oz,jin...)' },
        { path: '/api/convert/temperature?value=100&from=c&to=f', desc: '温度转换 (c,f,k,r)' },
        { path: '/api/convert/area?value=1&from=m2&to=cm2', desc: '面积转换 (m2,km2,ha,acre,mu...)' },
        { path: '/api/convert/volume?value=1&from=l&to=ml', desc: '体积转换 (l,ml,m3,gal,qt...)' },
        { path: '/api/convert/pressure?value=1&from=pa&to=kpa', desc: '压力转换 (pa,kpa,mpa,bar,atm,psi...)' },
        { path: '/api/convert/speed?value=1&from=mps&to=kph', desc: '速度转换 (mps,kph,mph,kn,mach)' },
        { path: '/api/convert/angle?value=180&from=deg&to=rad', desc: '角度转换 (deg,rad,grad,min,sec)' },
        { path: '/api/convert/force?value=1&from=n&to=kn', desc: '力转换 (n,kn,kgf,lbf...)' },
        { path: '/api/convert/energy?value=1&from=j&to=cal', desc: '能量转换 (j,cal,kcal,kwh...)' },
        { path: '/api/convert/power?value=1&from=w&to=kw', desc: '功率转换 (w,kw,hp,ps...)' },
        { path: '/api/convert/time?value=1&from=h&to=min', desc: '时间转换 (s,min,h,d,mo,y...)' },
        { path: '/api/convert/data?value=1&from=gb&to=mb', desc: '数据存储转换 (b,kb,mb,gb,tb,pb)' }
      ]
    }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在', path: req.path });
});

// 启动服务器（本地运行时使用）
if (process.env.NODE_ENV !== 'edgeone') {
  app.listen(port, () => {
    console.log(`Math API 服务器运行在 http://localhost:${port}`);
    console.log('按 Ctrl+C 停止服务器');
  });
}

// 导出 app（EdgeOne 边缘函数需要）
module.exports = app;
