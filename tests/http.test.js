const fs = require('fs')
const path = require('path')
const assert = require('assert')
const babel = require('@babel/core')
const Module = require('module')

// Transpile and load http.js
const filePath = path.resolve(__dirname, '../src/utils/http.js')
const source = fs.readFileSync(filePath, 'utf8')
const { code } = babel.transformSync(source, {
  presets: [['@babel/preset-env', { modules: 'commonjs' }]]
})

const m = new Module(filePath, module)
m.filename = filePath
m.paths = Module._nodeModulePaths(path.dirname(filePath))
m.require = function (request) {
  if (request === 'vant') {
    return { Toast: { fail: () => {} } }
  }
  if (request === '../router') {
    return { push: () => {} }
  }
  return Module.prototype.require.call(this, request)
}
m._compile(code, filePath)

const { http, checkCode } = m.exports

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
}

async function runTests() {
  const ok = checkCode({ status: 200, data: { msg: 'ok' } })
  assert.strictEqual(ok.status, 200)

  const unauth = checkCode({ status: 401, data: { error: 'no' } })
  assert.strictEqual(unauth.status, 401)

  const handler = http.interceptors.response.handlers[0].rejected
  const net = await handler({})
  assert.strictEqual(net.status, -1)

  console.log('http.js tests passed')
}

runTests()

