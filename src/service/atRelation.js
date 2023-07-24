/**
 * 微博 @ 用户关系 service
 */

const { AtRelation } = require('../db/model/Index')

async function createAtRelation(blogId, userId) {
    const result = await AtRelation.create({
        blogId,
        userId
    })
    return result.dataValues
}

module.exports = {
    createAtRelation
}