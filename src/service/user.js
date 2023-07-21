/**
 * @description user service
 */

const { User } = require('../db/model/Index')
const { formatUser } = require('./_format')
const { addFollower } = require('./user-relation')
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

async function createUser({userName, password, gender = 3, nickName}) {
    const result = await User.create({
        userName,
        password,
        nickName: nickName ? nickName : userName,
        gender
    })

    // 自己关注自己（为了方便首页获取数据）
    const data = result.dataValues
    addFollower(data.id, data.id)


    return result.dataValues
}

async function deleteUser(userName) {
    const result = await User.destroy({
        where: {
            userName
        }
    })
    // result 删除的行数
    return result > 0
}

/**
 * 
 * @param {object} param0
 * @param {object} param1
 * @returns
 */
async function updateUser(
    { newPassword, newNickName, newPicture, newCity },
    { userName, password }
) {
    
    // 拼接修改内容
    let updateData = {}
    if (newPassword) {
        updateData.password = newPassword
    }
    if (newNickName) {
        updateData.nickName = newNickName
    }
    if (newPicture) {
        updateData.picture = newPicture
    }
    if (newCity) {
        updateData.city = newCity
    }

    // 拼接查询条件
    let whereData = {
        userName
    }
    if (password) {
        whereData.password = password
    }

    // 执行修改
    const result = await User.update(updateData, {
        where: whereData
    })
    return result[0] > 0 // 修改的行数
}


module.exports = {
    getUserInfo,
    createUser,
    deleteUser,
    updateUser
}