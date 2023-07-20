/**
 * @description blog service
 * 
 */

const { Blog } = require('../db/model/Index')


/**
 * 创建微博
 * @param {Object} param0 创建微博所需的数据 { userId, content, image }
 * @returns
 */
async function createBlog({ userId, content, image }) {
    const result = await Blog.create({
        userId,
        content,
        image
    })
    return result.dataValues
}

module.exports = {
    createBlog
}