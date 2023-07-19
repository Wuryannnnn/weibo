/**
 * @description user 数据格式校验
 */

const validate = require('./_validate')

const SCHEMA = {
    type: 'object',
    properties: {
        userName: {
            type: 'string',
            pattern: '^[a-zA-Z][a-zA-Z0-9_]+$',
            maxLength: 255,
            minLength: 2
        },
        password: {
            type: 'string',
            maxLength: 255,
            minLength: 3
        },
        newPassword: {
            type: 'string',
            maxLength: 255,
            minLength: 3
        },
        nickName: {
            type: 'string',
            maxLength: 255,
            minLength: 3
        },
        picture: {
            type: 'string',
            maxLength: 255,
            minLength: 3
        },
        city: {
            type: 'string',
            maxLength: 255,
            minLength: 3
        }
    }
}

function userValidate(data = {}) {
    return validate(SCHEMA, data)
}

module.exports = userValidate