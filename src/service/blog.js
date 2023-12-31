/**
 * @description blog service
 * 
 */

const { Blog, User, UserRelation } = require('../db/model/Index')
const { formatUser, formatBlog} = require('./_format')

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

async function getBlogListByUser({ userName, pageIndex = 0, pageSize = 10 }) {
    // 拼接查询条件
    const userWhereOpts = {}
    if (userName) {
        userWhereOpts.userName = userName
    }
    // 执行查询
    const result = await Blog.findAndCountAll({
        limit: pageSize, // 每页多少条
        offset: pageSize * pageIndex, // 跳过多少条
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: User,
                attributes: ['userName', 'nickName', 'picture'],
                where: userWhereOpts
            }
        ]
    })
    // result.count 总数，跟分页无关
    // result.rows 查询结果，数组
    // 获取 dataValues
    let blogList = result.rows.map(row => row.dataValues)
    // 格式化
    blogList = formatBlog(blogList)
    blogList = blogList.map(blogItem => {
        const user = blogItem.user.dataValues
        blogItem.user = formatUser(user)
        return blogItem
    })
    return {
        count: result.count,
        blogList
    }
}

async function getFollowersBlogList({ userId, pageIndex = 0, pageSize = 10 }) {
    
    const result = await Blog.findAndCountAll({
        limit: pageSize, // 每页多少条
        offset: pageSize * pageIndex, // 跳过多少条
        order: [
            ['id', 'desc']
        ],
        include: [
            {
                model: User,
                attributes: ['userName', 'nickName', 'picture']
            },
            {
                model: UserRelation,
                attributes: ['userId', 'followerId'],
                where: { userId }
            }
        ]
    })
    // result.count 总数，跟分页无关
    // result.rows 查询结果，数组
    // 获取 dataValues
    
    let blogList = result.rows.map(row => row.dataValues)
    // 格式化
    blogList = formatBlog(blogList)
    blogList = blogList.map(blogItem => {
        const user = blogItem.user.dataValues
        blogItem.user = formatUser(user)
        return blogItem
    })
    return {
        count: result.count,
        blogList
    }
}


module.exports = {
    createBlog,
    getBlogListByUser,
    getFollowersBlogList
}