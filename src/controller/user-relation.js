/**
 * @description 用户关系 controller
 */

const { getUsersByFollower, getFollowersByUser } = require('../service/user-relation')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
/**
 * 根据 userId 获取粉丝列表
 * @param {number} userId 用户 id
 * @returns {Promise<void>}
 * 
 */

async function getFans(userId) {
    const { count, userList } = await getUsersByFollower(userId)
    return new SuccessModel({
        count,
        fansList: userList
    })
}

/**
 * 获取关注人列表
 * @param {number} userId 用户 id
 * @returns {Promise<void>}
 */

async function getFollowers(userId) {
    const { count, userList } = await getFollowersByUser(userId)
    return {
        count,
        followersList: userList
    }
}

module.exports = {
    getFans,
    getFollowers
}
