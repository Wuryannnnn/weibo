const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// 引入 koa-session
const session = require('koa-generic-session')
// 引入 redis
const redisStore = require('koa-redis')

const { REDIS_CONF } = require('./conf/db')
const {SESSION_SECRET_KEY} = require('./conf/secretKeys')

const index = require('./routes/index')
const userViewRouter = require('./routes/view/user')
const errorViewRouter = require('./routes/view/error')
const userAPIRouter = require('./routes/api/user')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// 配置 session
app.keys = [SESSION_SECRET_KEY];
app.use(session({
  // 配置 cookie
  key: 'weibo.sid', // cookie name 默认是 'koa.sid'
  prefix: 'weibo:sess:', // redis key 的前缀，默认是 'koa:sess:'
  cookie: {
    path: '/', // 生成 cookie 的路径
    httpOnly: true, // 只能服务端修改
    maxAge: 24 * 60 * 60 * 1000 // 过期时间，单位 ms
  },
  // 配置 redis
  store: redisStore({
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))


// routes
app.use(index.routes(), index.allowedMethods())
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods()) // errorViewRouter.allowedMethods() 作用：如果请求了 errorViewRouter 中没有的路由，会返回 404，而不是返回 500

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
