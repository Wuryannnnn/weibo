/**
 * @description 首页 API 路由
 * 
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginCheck')
const { create } = require('../../controller/blog-home')
const { genValidator } = require('../../middlewares/validator')
const blogValidate = require('../../validator/blog')
const { getHomeBlogList } = require('../../controller/blog-home')
const { getBlogListStr } = require('../../utils/blog')

router.prefix('/api/blog')

router.post('/create', loginCheck, genValidator(blogValidate), async (ctx, next) => {
    const { content, image } = ctx.request.body
    const { id: userId } = ctx.session.userInfo
    // controller
    ctx.body = await create({ userId, content, image })
}
)

router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
    let { pageIndex } = ctx.params
    pageIndex = parseInt(pageIndex)
    const { id: userId } = ctx.session.userInfo
    const result = await getHomeBlogList(userId, pageIndex)
    // 渲染为 html 字符串
    result.data.blogListTpl = getBlogListStr(result.data.blogList)

    ctx.body = result
}
)

module.exports = router