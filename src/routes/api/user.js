/**
 * @description user API 路由
 */

const router = require('koa-router')()
const { isExist, register, login, deleteCurUser } = require('../../controller/user')
const { genValidator } = require('../../middlewares/validator')
const userValidate = require('../../validator/user')
const {isTest} = require('../../utils/env')
const {loginCheck} = require('../../middlewares/loginCheck')

router.prefix('/api/user')

// 注册路由
router.post('/register', genValidator(userValidate),async (ctx, next) => {
    const { userName, password, gender } = ctx.request.body
    ctx.body = await register({
        userName,
        password,
        gender
    })
}
)

// 判断用户名是否存在
router.post('/isExist', async (ctx, next) => {
    const { userName } = ctx.request.body;
    ctx.body = await isExist(userName)
}
)

router.post('/login', async (ctx, next) => {
    const { userName, password } = ctx.request.body;
    ctx.body = await login(ctx, userName, password)
})

router.post('/delete', loginCheck, async (ctx, next) => {
    if(isTest){
        const { userName } = ctx.session.userInfo
        ctx.body = await deleteCurUser(userName)
    }
})

module.exports = router