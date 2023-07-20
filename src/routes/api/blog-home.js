/**
 * @description 首页 API 路由
 * 
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginCheck')
const { create } = require('../../controller/blog-home')
const { genValidator } = require('../../middlewares/validator')
const blogValidate = require('../../validator/blog')

router.prefix('/api/blog')

router.post('/create', loginCheck, genValidator(blogValidate), async (ctx, next) => {
    const { content, image } = ctx.request.body
    const { id: userId } = ctx.session.userInfo
    // controller
    ctx.body = await create({ userId, content, image })
}
)

module.exports = router