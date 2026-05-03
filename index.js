/**
 * EdgeOne 边缘函数入口
 * 
 * EdgeOne 边缘函数基于标准 Web API，每次请求触发一次 fetch 处理
 * 不需要 Express，不需要监听端口，不需要持久进程
 */

// ========== 数学计算模块 ==========
function validateNumbers(...values) {
  for (const v of values) {
    if (typeof v !== 'number' || isNaN(v)) {
      throw new Error('参数必须是有效的数字');
    }
  }
}

function getHome() {
  return {
    message: '欢迎使用数学计算与单位转换 API（EdgeOne 边缘函数版）',
    version: '2.0.0',
    platform: 'EdgeOne Edge Function',
    endpoints: {
      math: {
        get: [
          '/api/math/operations',
          '/api/math/calculate?op=add&a=10&b=20',
          '/api/math/factorial?n=5',
          '/api/math/fibonacci?n=10',
          '/api/math/sum?numbers=1,2,3,4,5',
          '/api/math/prime?n=17'
        ],
        post: [
          '/api/math/add',
          '/api/math/subtract',
          '/api/math/multiply',
          '/api/math/divide',
          '/api/math/power',
          '/api/math/sqrt',
          '/api/math/percentage',
          '/api/math/circleArea'
        ]
      },
      convert: {
        get: [
          '/api/convert/units',
          '/api/convert/length?value=1&from=m&to=cm',
          '/api/convert/weight?value=1&from=kg&to=lb',
          '/api/convert/temperature?value=100&from=C&to=F',
          '/api/convert/speed?value=100&from=km/h&to=m/s',
          '/api/convert/pressure?value=1&from=MPa&to=bar',
          '/api/convert/all?value=1&from=m'
        ],
        post: [
          '/api/convert/length',
          '/api/convert/weight',
          '/api/convert/temperature',
          '/api/convert/speed',
          '/api/convert/pressure'
        ]
      }
    },
    tip: 'GET 接口可直接在浏览器访问，POST 接口需要使用测试工具'
  };
}

function getMathOperations() {
  return {
    message: '支持的数学运算列表',
    operations: [
      { name: 'add', desc: '加法', example: 'GET /api/math/calculate?op=add&a=10&b=20', params: 'a, b' },
      { name: 'subtract', desc: '减法', example: 'GET /api/math/calculate?op=subtract&a=50&b=20', params: 'a, b' },
      { name: 'multiply', desc: '乘法', example: 'GET /api/math/calculate?op=multiply&a=5&b=6', params: 'a, b' },
      { name: 'divide', desc: '除法', example: 'GET /api/math/calculate?op=divide&a=100&b=4', params: 'a, b' },
      { name: 'power', desc: '幂运算', example: 'GET /api/math/calculate?op=power&a=2&b=10', params: 'a, b' },
      { name: 'sqrt', desc: '开平方', example: 'GET /api/math/calculate?op=sqrt&a=16', params: 'a' },
      { name: 'percentage', desc: '百分比', example: 'GET /api/math/calculate?op=percentage&a=200&b=15', params: 'a, b' },
      { name: 'circleArea', desc: '圆面积', example: 'GET /api/math/calculate?op=circleArea&r=5', params: 'r' }
    ],
    extra_get_apis: [
      { path: '/api/math/factorial?n=5', desc: '阶乘计算' },
      { path: '/api/math/fibonacci?n=10', desc: '斐波那契数列前 n 项' },
      { path: '/api/math/sum?numbers=1,2,3,4,5', desc: '批量求和' },
      { path: '/api/math/prime?n=17', desc: '判断质数' }
    ],
    note: '也可以使用 POST 请求，请求体为 JSON 格式'
  };
}

function calculate(params) {
  const op = params.get('op');
  const a = params.get('a') !== null ? parseFloat(params.get('a')) : undefined;
  const b = params.get('b') !== null ? parseFloat(params.get('b')) : undefined;
  const r = params.get('r') !== null ? parseFloat(params.get('r')) : undefined;

  if (!op) {
    throw new Error('缺少 op 参数，如 ?op=add');
  }

  let result;
  switch (op) {
    case 'add':
      validateNumbers(a, b);
      result = a + b;
      break;
    case 'subtract':
      validateNumbers(a, b);
      result = a - b;
      break;
    case 'multiply':
      validateNumbers(a, b);
      result = a * b;
      break;
    case 'divide':
      validateNumbers(a, b);
      if (b === 0) throw new Error('除数不能为 0');
      result = a / b;
      break;
    case 'power':
      validateNumbers(a, b);
      result = Math.pow(a, b);
      break;
    case 'sqrt':
      validateNumbers(a);
      if (a < 0) throw new Error('负数不能开平方');
      result = Math.sqrt(a);
      break;
    case 'percentage':
      validateNumbers(a, b);
      result = a * (b / 100);
      break;
    case 'circleArea':
      validateNumbers(r);
      if (r < 0) throw new Error('半径不能为负数');
      result = Math.PI * r * r;
      break;
    default:
      throw new Error(`不支持的运算: ${op}`);
  }

  return { operation: op, params: Object.fromEntries(params), result };
}

function factorial(params) {
  const n = parseInt(params.get('n'));
  if (isNaN(n) || n < 0) throw new Error('n 必须是非负整数');
  if (n > 170) throw new Error('n 太大，会超出 JavaScript 数字范围');

  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;

  return { operation: 'factorial', n, result };
}

function fibonacci(params) {
  const n = parseInt(params.get('n'));
  if (isNaN(n) || n < 1) throw new Error('n 必须是正整数');
  if (n > 1000) throw new Error('n 太大，请使用小于 1000 的数字');

  const sequence = [];
  let a = 0, b = 1;
  for (let i = 0; i < n; i++) {
    sequence.push(a);
    const temp = a + b;
    a = b;
    b = temp;
  }

  return { operation: 'fibonacci', n, sequence, count: sequence.length };
}

function sum(params) {
  const numbersStr = params.get('numbers');
  if (!numbersStr) throw new Error('缺少 numbers 参数，如 ?numbers=1,2,3');

  const numbers = numbersStr.split(',').map(n => parseFloat(n.trim()));
  if (numbers.some(isNaN)) throw new Error('numbers 参数格式错误，请使用逗号分隔的数字');

  const result = numbers.reduce((acc, curr) => acc + curr, 0);
  return { operation: 'sum', numbers, count: numbers.length, result };
}

function prime(params) {
  const n = parseInt(params.get('n'));
  if (isNaN(n) || n < 1) throw new Error('n 必须是正整数');

  let isPrime = true;
  if (n === 1) isPrime = false;
  else if (n === 2) isPrime = true;
  else if (n % 2 === 0) isPrime = false;
  else {
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) { isPrime = false; break; }
    }
  }

  return { operation: 'prime', n, isPrime, description: isPrime ? `${n} 是质数` : `${n} 不是质数` };
}

function mathPost(body, operation) {
  const { a, b, r } = body;
  let result;

  switch (operation) {
    case 'add':
      validateNumbers(a, b);
      result = a + b;
      return { operation, a, b, result };
    case 'subtract':
      validateNumbers(a, b);
      result = a - b;
      return { operation, a, b, result };
    case 'multiply':
      validateNumbers(a, b);
      result = a * b;
      return { operation, a, b, result };
    case 'divide':
      validateNumbers(a, b);
      if (b === 0) throw new Error('除数不能为 0');
      result = a / b;
      return { operation, a, b, result };
    case 'power':
      validateNumbers(a, b);
      result = Math.pow(a, b);
      return { operation, a, b, result };
    case 'sqrt':
      validateNumbers(a);
      if (a < 0) throw new Error('负数不能开平方');
      result = Math.sqrt(a);
      return { operation, a, result };
    case 'percentage':
      validateNumbers(a, b);
      result = a * (b / 100);
      return { operation, a, percent: b, result };
    case 'circleArea':
      validateNumbers(r);
      if (r < 0) throw new Error('半径不能为负数');
      result = Math.PI * r * r;
      return { operation, radius: r, result };
    default:
      throw new Error(`不支持的运算: ${operation}`);
  }
}

// ========== 单位转换模块 ==========
function validateNumber(value) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('value 必须是有效的数字');
  }
}

function getConvertUnits() {
  return {
    message: '支持的单位转换列表',
    conversions: {
      length: { units: ['m', 'km', 'cm', 'mm', 'inch', 'ft'], example: 'GET /api/convert/length?value=1&from=m&to=cm' },
      weight: { units: ['kg', 'g', 't', 'lb', 'oz'], example: 'GET /api/convert/weight?value=1&from=kg&to=lb' },
      temperature: { units: ['C', 'F', 'K'], example: 'GET /api/convert/temperature?value=100&from=C&to=F' },
      speed: { units: ['m/s', 'km/h', 'mph'], example: 'GET /api/convert/speed?value=100&from=km/h&to=m/s' },
      pressure: { units: ['Pa', 'kPa', 'MPa', 'bar', 'psi'], example: 'GET /api/convert/pressure?value=1&from=MPa&to=bar' }
    },
    extra_get_apis: [
      { path: '/api/convert/all?value=1&from=m', desc: '一次性转换为多种单位' }
    ],
    note: '也可以使用 POST 请求，请求体为 JSON 格式'
  };
}

function convertLength(value, from, to) {
  validateNumber(value);
  const toMeter = { m: 1, km: 1000, cm: 0.01, mm: 0.001, inch: 0.0254, ft: 0.3048 };
  if (!toMeter[from] || !toMeter[to]) {
    throw new Error('不支持的长度单位。支持: m, km, cm, mm, inch, ft');
  }
  const meters = value * toMeter[from];
  return { type: 'length', from, to, original: value, converted: meters / toMeter[to] };
}

function convertWeight(value, from, to) {
  validateNumber(value);
  const toKg = { kg: 1, g: 0.001, t: 1000, lb: 0.453592, oz: 0.0283495 };
  if (!toKg[from] || !toKg[to]) {
    throw new Error('不支持的重量单位。支持: kg, g, t, lb, oz');
  }
  const kgs = value * toKg[from];
  return { type: 'weight', from, to, original: value, converted: kgs / toKg[to] };
}

function convertTemperature(value, from, to) {
  validateNumber(value);
  let celsius;
  if (from === 'C') celsius = value;
  else if (from === 'F') celsius = (value - 32) * 5 / 9;
  else if (from === 'K') celsius = value - 273.15;
  else throw new Error('from 单位必须是 C, F, K 之一');

  let result;
  if (to === 'C') result = celsius;
  else if (to === 'F') result = celsius * 9 / 5 + 32;
  else if (to === 'K') result = celsius + 273.15;
  else throw new Error('to 单位必须是 C, F, K 之一');

  return { type: 'temperature', from, to, original: value, converted: result };
}

function convertSpeed(value, from, to) {
  validateNumber(value);
  const toMps = { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704 };
  if (!toMps[from] || !toMps[to]) {
    throw new Error('不支持的速度单位。支持: m/s, km/h, mph');
  }
  const mps = value * toMps[from];
  return { type: 'speed', from, to, original: value, converted: mps / toMps[to] };
}

function convertPressure(value, from, to) {
  validateNumber(value);
  const toPa = { Pa: 1, kPa: 1000, MPa: 1000000, bar: 100000, psi: 6894.76 };
  if (!toPa[from] || !toPa[to]) {
    throw new Error('不支持的压力单位。支持: Pa, kPa, MPa, bar, psi');
  }
  const pascals = value * toPa[from];
  return { type: 'pressure', from, to, original: value, converted: pascals / toPa[to] };
}

function convertAll(params) {
  const value = parseFloat(params.get('value'));
  const from = params.get('from');
  validateNumber(value);

  const toMeter = { m: 1, km: 1000, cm: 0.01, mm: 0.001, inch: 0.0254, ft: 0.3048 };
  if (!toMeter[from]) {
    throw new Error('不支持的 from 单位。支持: m, km, cm, mm, inch, ft');
  }

  const meters = value * toMeter[from];
  const results = {};
  for (const [unit, factor] of Object.entries(toMeter)) {
    results[unit] = meters / factor;
  }

  return {
    type: 'length_all',
    original: { value, unit: from },
    base: { value: meters, unit: 'm' },
    conversions: results
  };
}

// ========== 边缘函数主入口 ==========
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS 预检请求处理
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    };

    try {
      let result;

      // ========== 首页 ==========
      if (path === '/' && method === 'GET') {
        result = getHome();
      }

      // ========== 数学计算 GET ==========
      else if (path === '/api/math/operations' && method === 'GET') {
        result = getMathOperations();
      }
      else if (path === '/api/math/calculate' && method === 'GET') {
        result = calculate(url.searchParams);
      }
      else if (path === '/api/math/factorial' && method === 'GET') {
        result = factorial(url.searchParams);
      }
      else if (path === '/api/math/fibonacci' && method === 'GET') {
        result = fibonacci(url.searchParams);
      }
      else if (path === '/api/math/sum' && method === 'GET') {
        result = sum(url.searchParams);
      }
      else if (path === '/api/math/prime' && method === 'GET') {
        result = prime(url.searchParams);
      }

      // ========== 数学计算 POST ==========
      else if (path === '/api/math/add' && method === 'POST') {
        const body = await request.json();
        result = mathPost(body, 'add');
      }
      else if (path === '/api/math/subtract' && method === 'POST') {
        const body = await request.json();
        result = mathPost(body, 'subtract');
      }
      else if (path === '/api/math/multiply' && method === 'POST') {
        const body = await request.json();
        result = mathPost(body, 'multiply');
      }
      else if (path === '/api/math/divide' && method === 'POST') {
        const body = await request.json();
        result = mathPost(body, 'divide');
      }
      else if (path === '/api/math/power' && method === 'POST') {
        const body = await request.json();
        result = mathPost(body, 'power');
      }
      else if (path === '/api/math/sqrt' && method === 'POST') {
        const body = await request.json();
        result = mathPost(body, 'sqrt');
      }
      else if (path === '/api/math/percentage' && method === 'POST') {
        const body = await request.json();
        result = mathPost(body, 'percentage');
      }
      else if (path === '/api/math/circleArea' && method === 'POST') {
        const body = await request.json();
        result = mathPost(body, 'circleArea');
      }

      // ========== 单位转换 GET ==========
      else if (path === '/api/convert/units' && method === 'GET') {
        result = getConvertUnits();
      }
      else if (path === '/api/convert/length' && method === 'GET') {
        const value = parseFloat(url.searchParams.get('value'));
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        result = convertLength(value, from, to);
      }
      else if (path === '/api/convert/weight' && method === 'GET') {
        const value = parseFloat(url.searchParams.get('value'));
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        result = convertWeight(value, from, to);
      }
      else if (path === '/api/convert/temperature' && method === 'GET') {
        const value = parseFloat(url.searchParams.get('value'));
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        result = convertTemperature(value, from, to);
      }
      else if (path === '/api/convert/speed' && method === 'GET') {
        const value = parseFloat(url.searchParams.get('value'));
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        result = convertSpeed(value, from, to);
      }
      else if (path === '/api/convert/pressure' && method === 'GET') {
        const value = parseFloat(url.searchParams.get('value'));
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        result = convertPressure(value, from, to);
      }
      else if (path === '/api/convert/all' && method === 'GET') {
        result = convertAll(url.searchParams);
      }

      // ========== 单位转换 POST ==========
      else if (path === '/api/convert/length' && method === 'POST') {
        const body = await request.json();
        result = convertLength(body.value, body.from, body.to);
      }
      else if (path === '/api/convert/weight' && method === 'POST') {
        const body = await request.json();
        result = convertWeight(body.value, body.from, body.to);
      }
      else if (path === '/api/convert/temperature' && method === 'POST') {
        const body = await request.json();
        result = convertTemperature(body.value, body.from, body.to);
      }
      else if (path === '/api/convert/speed' && method === 'POST') {
        const body = await request.json();
        result = convertSpeed(body.value, body.from, body.to);
      }
      else if (path === '/api/convert/pressure' && method === 'POST') {
        const body = await request.json();
        result = convertPressure(body.value, body.from, body.to);
      }

      // ========== 404 ==========
      else {
        return new Response(JSON.stringify({ error: '接口不存在，请检查路径', path }), {
          status: 404,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: corsHeaders
      });
    }
  }
};
