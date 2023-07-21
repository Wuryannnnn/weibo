/**
 * @description 用户关系 service
 */

const { User, UserRelation } = require('../db/model/Index')
const { formatUser } = require('./_format')
const Sequelize = require('sequelize')

/**
 * 获取粉丝列表，根据被关注人id
 * @param {number} followerId 被关注人id
 * @returns {Promise<void>}
 */

async function getUsersByFollower(followerId) {
    const result = await User.findAndCountAll({
        attributes: ['id', 'userName', 'nickName', 'picture'],
        order: [
            ['id', 'desc']
        ],
        include: [{
            model: UserRelation,
            where: {
                followerId,
                userId: {
                    [Sequelize.Op.ne]: followerId
                }
            }
        }]
    })
    // result.count 总数
    // result.rows 查询结果，数组

    let userList = result.rows.map(row => row.dataValues)
    userList = formatUser(userList)

    return {
        count: result.count,
        userList
    }
}

/**
 * 添加关注关系
 * @param {number} followerId 被关注人id
 * @param {number} userId 关注人id
 * @returns {Promise<void>}
 */
async function addFollower(userId, followerId) {
    const result = await UserRelation.create({
        userId,
        followerId
    })
    return result.dataValues
}

/**
 * 删除关注关系
 * @param {number} followerId 被关注人id
 * @param {number} userId 关注人id
 * @returns {Promise<void>}
 */
async function removeFollower(userId, followerId) {
    const result = await UserRelation.destroy({
        where: {
            userId,
            followerId
        }
    })
    // result 删除的行数
    return result > 0
}

/**
 * 获取关注人列表
 * 
 * @param {number} userId 用户id
 * @returns {Promise<void>}
 */

async function getFollowersByUser(userId) {
    const result = await UserRelation.findAndCountAll({
        order: [
            ['id', 'desc']
        ],
        include: [{
            model: User,
            attributes: ['id', 'userName', 'nickName', 'picture']
        }],
        where: {
            userId,
            followerId: {
                [Sequelize.Op.ne]: userId
            }
        }
    })
    // result.count 总数
    // result.rows 查询结果，数组

    let userList = result.rows.map(row => row.dataValues)
    userList = userList.map(item => {
        let user = item.user
        user = user.dataValues
        user = formatUser(user)
        return user
    })

    return {
        count: result.count,
        userList
    }
}





module.exports = {
    getUsersByFollower,
    addFollower,
    removeFollower,
    getFollowersByUser
}
