/**
 * @description 连接 redis 的方法 get set
 * @author wurui
 */

const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
// 创建客户端
(async () => {
    await redisClient.connect().then(() => {
        console.log('redis connect success')
    }
    ).catch(err => {
        console.log('redis connect error', err)
    }
    )

    // redisClient.quit()
})()

/**
 * redis set
 * @param {string} key key
 * @param {string} val val
 * @param {number} timeout 过期时间，单位 s
 */

async function set(key, val, timeout = 60 * 60) {
    if(typeof val === 'object') {
        val = JSON.stringify(val)
    }
    await redisClient.set(key, val)
    redisClient.expire(key, timeout)
}

/**
 * redis get
 * @param {string} key key
 * @return {Promise}
 * 
 */

async function get(key) {
    try {
        const val = await redisClient.get(key)
        if(val == null) {
            return null
        }
        try {
            return JSON.parse(val)
        } catch (ex) {
            return val
        }
    } catch (ex) {
        console.error(ex)
        return null
    }
}


module.exports = {
    set,
    get
}