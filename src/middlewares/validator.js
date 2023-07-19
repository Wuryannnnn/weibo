/**
 * @description json schema 校验中间件
 */
const { ErrorModel } = require('../model/ResModel')
const { jsonSchemaFileInfo } = require('../model/ErrorInfo')
/**
 * 生成 json schema 验证的中间件
 * @param {function} validateFn 验证函数
 * @returns {function}
 */
function genValidator(validateFn){
    async function validator(ctx, next){
        const error = validateFn(ctx.request.body);
        if(error){
            ctx.body = new ErrorModel(jsonSchemaFileInfo);
            return;
        }
        await next();
    }
    return validator;
}

module.exports = {
    genValidator
}