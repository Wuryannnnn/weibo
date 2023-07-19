/**
 * @description user API 路由
 */

const router = require('koa-router')()
const { isExist } = require('../../controller/user')

router.prefix('/api/user')

// 注册路由
router.post('/register', async (ctx, next) => {
    const { userName, password } = ctx.request.body
    ctx.body = {
        errno: 0,
        userName,
        password
    }
}
)

// 判断用户名是否存在
router.post('/isExist', async (ctx, next) => {
    const { userName } = ctx.request.body;
    ctx.body = await isExist(userName)
}
)

module.exports = router