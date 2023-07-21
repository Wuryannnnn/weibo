const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')
// 引入 koa-session
const session = require('koa-generic-session')
// 引入 redis
const redisStore = require('koa-redis')

const { REDIS_CONF } = require('./conf/db')
const {SESSION_SECRET_KEY} = require('./conf/secretKeys')

const squareAPIRouter = require('./routes/api/blog-square')
const profileAPIRouter = require('./routes/api/blog-profile')
const blogViewRouter = require('./routes/view/blog')
const userViewRouter = require('./routes/view/user')
const errorViewRouter = require('./routes/view/error')
const userAPIRouter = require('./routes/api/user')
const utilsAPIRouter = require('./routes/api/utils')
const blogHomeAPIRouter = require('./routes/api/blog-home')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(path.join(__dirname, '..', 'uploadFiles')))

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
app.use(squareAPIRouter.routes(), squareAPIRouter.allowedMethods())
app.use(profileAPIRouter.routes(), profileAPIRouter.allowedMethods())
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(blogHomeAPIRouter.routes(), blogHomeAPIRouter.allowedMethods())
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods())
app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods()) // errorViewRouter.allowedMethods() 作用：如果请求了 errorViewRouter 中没有的路由，会返回 404，而不是返回 500

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
