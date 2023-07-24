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

async function getAtRelationCount(userId) {
    const result = await AtRelation.findAndCountAll({
        where: {
            userId,
            isRead: false
        }
    })
    return result.count
}

module.exports = {
    createAtRelation,
    getAtRelationCount
}