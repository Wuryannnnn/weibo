/**
 * @description user controller
 */

const { getUserInfo, createUser, deleteUser, updateUser } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { registerUserNameNotExistInfo, registerUserNameExistInfo, registerFailInfo, loginFailInfo, deleteUserFailInfo, changeInfoFailInfo, changePasswordFailInfo } = require('../model/ErrorInfo')
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

/**
 * 
 * @param {*} userName
 * @returns
 */
async function deleteCurUser(userName) {
    const result = await deleteUser(userName)
    if (result) {
        // 成功
        return new SuccessModel()
    }
    // 失败
    return new ErrorModel(deleteUserFailInfo)
}

/**
 * 
 * @param {*} ctx
 * @param {*} param1
 * @param {*} param2
 * @param {*} param3
 * @returns
 */
async function changeInfo(ctx, { nickName, city, picture }) {
    const { userName } = ctx.session.userInfo
    if (!nickName) {
        nickName = userName
    }

    // service
    const result = await updateUser({
        newNickName: nickName,
        newCity: city,
        newPicture: picture
    }, {
        userName
    })
    if (result) {
        // 执行成功
        Object.assign(ctx.session.userInfo, {
            nickName,
            city,
            picture
        })
        // 返回
        return new SuccessModel()
    }
    // 失败
    return new ErrorModel(changeInfoFailInfo)
}

/**
 * 
 * @param {username} param0
 * @param {password} param1
 * @param {newPassword} param2
 * @returns 
 */
async function changePassword(userName, password, newPassword){
    const result = await updateUser({
        newPassword: doCrypto(newPassword)
    }, {
        userName,
        password: doCrypto(password)
    })
    if (result) {
        // 成功
        return new SuccessModel()
    }
    // 失败
    return new ErrorModel(changePasswordFailInfo)
}

/**
 * 退出登录
 * @param {*} ctx
 * @returns
 */
async function logout(ctx){
    delete ctx.session.userInfo
    return new SuccessModel()
}

module.exports = {
    isExist,
    register,
    login,
    deleteCurUser,
    changeInfo,
    changePassword,
    logout
}