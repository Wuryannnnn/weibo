/**
 * @description 用户关系 controller
 */

const { getUsersByFollower, getFollowersByUser, addFollower, removeFollower } = require('../service/user-relation')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { addFollowerFailInfo, removeFollowerFailInfo } = require('../model/ErrorInfo')
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

/**
 * 
 */
async function follow(myUserId, curUserId) {
    // controller
    try {
        await addFollower(myUserId, curUserId)
        return new SuccessModel()
    } catch (ex) {
        console.error(ex)
        return new ErrorModel(addFollowerFailInfo)
    }
}

/**
 * 取消关注
 * @param {number} myUserId 当前用户 id
 * @param {number} curUserId 要被取消关注的用户 id
 * @returns {Promise<void>}
 *
 */
async function unFollow(myUserId, curUserId) {
    // controller
    const result = await removeFollower(myUserId, curUserId)
    if (result) {
        return new SuccessModel()
    }
    return new ErrorModel(removeFollowerFailInfo)
}

async function getFollowers(userId) {
    const { count, userList } = await getFollowersByUser(userId)
    return new SuccessModel({
        count,
        followersList: userList
    })
}


module.exports = {
    getFans,
    follow,
    unFollow,
    getFollowers
}
