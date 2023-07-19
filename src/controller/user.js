/**
 * @description user controller
 */

const { getUserInfo } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { registerUserNameNotExistInfo } = require('../model/ErrorInfo')

async function isExist(userName) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        // 已存在
        return new SuccessModel(userInfo)
    }else{
        // 不存在
        return new ErrorModel(registerUserNameNotExistInfo)
    }
}

module.exports = {
    isExist
}