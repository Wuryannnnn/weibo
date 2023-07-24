/**
 * 微博 @ 关系 controller
 */

const { PAGE_SIZE } = require('../conf/constant')
const { SuccessModel } = require('../model/ResModel')
const { getAtRelationCount, getAtUserBlogList, updateAtRelation } = require('../service/atRelation')

/**
 * 
 * @param {number} userId 用户 id
 * @param {number} pageIndex 当前页面
 * @returns
 */
async function getAtMeCount(userId) {
    const result = await getAtRelationCount(userId)
    return new SuccessModel({
        count: result
    })
}

async function getAtMeBlogList(userId, pageIndex = 0) {
    const result = await getAtUserBlogList({
        userId,
        pageIndex,
        pageSize: PAGE_SIZE
    })
    const { count, blogList } = result

    // 返回
    return new SuccessModel({
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: PAGE_SIZE,
        pageIndex,
        count
    })
}

async function markAsRead(userId) {
    try {
        await updateAtRelation(
            { newIsRead: true },
            { userId, isRead: false }
        )
    } catch (ex) {
        console.error(ex)
    }
    // 不需要返回 SuccessModel 或者 ErrorModel
}

module.exports = {
    getAtMeCount,
    getAtMeBlogList,
    markAsRead
}