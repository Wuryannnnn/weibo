/**
 * @description user controller
 */

const { getUserInfo, createUser } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { registerUserNameNotExistInfo, registerUserNameExistInfo, registerFailInfo, loginFailInfo } = require('../model/ErrorInfo')
const doCrypto = require('../utils/cryp')

async function isExist(userName) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        // 已存在
        return new SuccessModel(userInfo)
    }else{
        // 不存在
        return new ErrorModel(registerUserNameExistInfo);
    }

}

/**
 * 
 * @param {*} username
 * @param {*} password
 *  
 */
async function register({userName, password, gender}) {
    const userInfo = await getUserInfo(userName)
    if (userInfo) {
        // 用户名已存在
        return new ErrorModel(registerUserNameNotExistInfo)
    }

    // 注册 service
    try {
        await createUser({
            userName,
            password : doCrypto(password),
            gender
        })
        return new SuccessModel()
    } catch (ex) {
        console.error(ex.message, ex.stack)
        return new ErrorModel(registerFailInfo)
    }
}

/**
 * 
 * @param {*} ctx
 * @param {*} userName
 * @param {*} password
 * @returns
 */ 
async function login(ctx, userName, password) {
    // 登录成功 ctx.session.userInfo = xxx
    // 登录失败 ctx.body = xxx
    const userInfo = await getUserInfo(userName, doCrypto(password))
    if (!userInfo) {
        // 登录失败
        return new ErrorModel(loginFailInfo)
    }

    // 登录成功
    if (ctx.session.userInfo == null) {
        ctx.session.userInfo = userInfo
    }
    return new SuccessModel()
}

module.exports = {
    isExist,
    register,
    login
}