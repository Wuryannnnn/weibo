/**
 * @description 个人主页 controller
 */
const {getBlogListByUser} = require('../service/blog')

/**
 * 获取微博列表
 * @param {string} userName 用户名
 * @param {number} pageIndex 页数
 * @returns {Promise<void>}
 */
async function getProfileBlogList(userName, pageIndex = 0) {
    const result = await getBlogListByUser({
        userName,
        pageIndex,
        pageSize: 5
    })
    const blogList = result.blogList
    
    // 拼接返回数据
    return {
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: 5,
        pageIndex,
        count: result.count
    }
}

module.exports = {
    getProfileBlogList
}
