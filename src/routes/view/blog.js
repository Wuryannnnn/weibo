/**
 * @description blog view 路由
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginCheck')
const { getProfileBlogList } = require('../../controller/blog-profile')
const { isExist } = require('../../controller/user')
const { getSquareBlogList } = require('../../controller/blog-square')
const { getFans, getFollowers } = require('../../controller/user-relation')
const { getHomeBlogList } = require('../../controller/blog-home')
const { getAtMeCount, getAtMeBlogList, markAsRead } = require('../../controller/blog-at')
// 首页
router.get('/', loginRedirect, async (ctx, next) => {
    const userInfo = ctx.session.userInfo
    const { id: userId } = userInfo
    console.log('userId', userId);
    //获取第一页数据
    const result = await getHomeBlogList(userId)
    const { isEmpty, blogList, pageSize, pageIndex, count } = result.data

    //获取粉丝  
    const fansResult = await getFans(userId)
    const { count: fansCount, fansList } = fansResult.data

    //获取关注人列表
    const followersResult = await getFollowers(userId)
    const { count: followersCount, followersList } = followersResult.data

    //获取 @ 数量
    const atCountResult = await getAtMeCount(userId)

    await ctx.render('index', {
        userData: {
            userInfo,
            fansData: {
                count: fansCount,
                list: fansList
            },
            followersData: {
                count: followersCount,
                list: followersList
            },
            atCount: atCountResult.data.count
        },
        blogData: {
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        }
    })
}
)

// 个人主页

router.get('/profile', loginRedirect, async (ctx, next) => {
    const { userName } = ctx.session.userInfo
    ctx.redirect(`/profile/${userName}`)
}
)
router.get('/profile/:userName', loginRedirect, async (ctx, next) => {
    const myUserInfo = ctx.session.userInfo
    const myUserName = myUserInfo.userName
    let curUserInfo;

    // 获取个人主页的微博第一页数据
    // controller
    const { userName: curUserName } = ctx.params
    const isMe = myUserName === curUserName
    if (isMe) {
        // 是当前登录用户
        curUserInfo = myUserInfo
    } else {
        // 不是当前登录用户
        const existResult = await isExist(curUserName)
        if (existResult.errno !== 0) {
            // 用户名不存在
            return
        }
        // 用户名存在
        curUserInfo = existResult.data
    }
    const result = await getProfileBlogList(curUserName, 0)
    
    const { isEmpty, blogList, pageSize, pageIndex, count } = result.data;

    // 获取粉丝
    const fansResult = await getFans(curUserInfo.id)
    const { count: fansCount, fansList } = fansResult.data

    // 我是否关注了此人？
    const amIFollowed = fansList.some(item => {
        return item.userName === myUserName
    })

    // 获取关注人列表
    const followersResult = await getFollowers(curUserInfo.id)
    const { count: followersCount, followersList } = followersResult.data

    // 获取 @ 数量
    const atCountResult = await getAtMeCount(myUserInfo.id)

    await ctx.render('profile', {
        blogData: {
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        },
        userData: {
            userInfo: curUserInfo,
            isMe,
            fansData: {
                count: fansCount,
                list: fansList
            },
            amIFollowed,
            followersData: {
                count: followersCount,
                list: followersList
            }
        },
        atCount: atCountResult.data.count
    })
}
)

// 广场
router.get('/square', loginRedirect, async (ctx, next) => {
    const result = await getSquareBlogList(0)
    const { isEmpty, blogList, pageSize, pageIndex, count } = result.data;
    await ctx.render('square', {
        blogData: {
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        }
    })
}
)

// atMe 路由
router.get('/at-me', loginRedirect, async (ctx, next) => {
    const { id: userId } = ctx.session.userInfo
    // 获取 @ 数量
    const atCountResult = await getAtMeCount(userId)
    const result = await getAtMeBlogList(userId)
    const { isEmpty, blogList, pageSize, pageIndex, count } = result.data;
    await ctx.render('atMe', {
        atCount: atCountResult.data.count,
        blogData: {
            isEmpty,
            blogList,
            pageSize,
            pageIndex,
            count
        }
    })
    // 标记为已读
    if (atCountResult.data.count > 0) {
        await markAsRead(userId)
    }
}
)


module.exports = router