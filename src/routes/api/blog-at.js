/**
 * @description 微博 api 路由
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginCheck')
const {getAtMeBlogList} = require('../../controller/blog-at')
const {getBlogListStr} = require('../../utils/blog')

router.prefix('/api/atMe')

// 加载更多
router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
    let {pageIndex} = ctx.params
    pageIndex = parseInt(pageIndex)
    const {id:userId} = ctx.session.userInfo
    const result = await getAtMeBlogList(userId, pageIndex)
    // 渲染为html字符串
    result.data.blogListTpl = getBlogListStr(result.data.blogList)

    ctx.body = result
})

module.exports = router