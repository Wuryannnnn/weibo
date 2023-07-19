/**
 * @description user service
 */

const { User } = require('../db/model/Index')
const { formatUser } = require('./_format')
/**
 * 用户名是否存在
 * @param {string} userName
 * @param {string} password
 */
async function getUserInfo(userName, password) {
    // 查询条件
    const whereOpt = {
        userName
    }
    // 如果有密码，再增加查询条件
    if (password) {
        Object.assign(whereOpt, { password })
    }

    // 查询
    const result = await User.findOne({
        attributes: ['id', 'userName', 'nickName', 'picture', 'city'],
        where: whereOpt
    })
    if (result == null) {
        // 未找到
        return result
    }

    // 格式化
    const formatRes = formatUser(result.dataValues)

    return formatRes
}

module.exports = {
    getUserInfo
}