/**
 * @description user api test
 */

const server = require('../server')

// 用户信息
const userName = `u_${Date.now()}`
const password = `p_${Date.now()}`
const testUser = {
    userName,
    password,
    nickName: userName,
    gender: 1
}

// 存储 cookie
let COOKIE = ''

// 注册
test('Register a user, should succeed', async () => {
    const res = await server.post('/api/user/register').send(testUser)
    expect(res.body.errno).toBe(0)
}
)

// 重复注册
test('Register a user again, should fail', async () => {
    const res = await server.post('/api/user/register').send(testUser)
    expect(res.body.errno).not.toBe(0)
}
)

// 查询用户是否存在
test('Query user, should succeed', async () => {
    const res = await server.post('/api/user/isExist').send({ userName })
    expect(res.body.errno).toBe(0)
}
)

// json schema 检测
test('json schema 检测, 非法格式，注册应该失败', async () => {
    const res = await server.post('/api/user/register').send({
        userName: '123', // 用户名不是字母（或下划线）开头
        password: 'a', // 最小长度不是 3
        // nickName: ''
        gender: 'mail' // 不是数字
    })
    expect(res.body.errno).not.toBe(0)
}
)

// 登录
test('Login, should succeed', async () => {
    const res = await server.post('/api/user/login').send({
        userName,
        password
    })
    expect(res.body.errno).toBe(0)

    // 获取 cookie
    COOKIE = res.headers['set-cookie'].join(';')
}
)

// delete
test('Delete a user, should succeed', async () => {
    const res = await server.post('/api/user/delete').set('cookie', COOKIE)
    expect(res.body.errno).toBe(0)
}
)

// requry after delete
test('Query after delete, should fail', async () => {
    const res = await server.post('/api/user/isExist').send({ userName })
    expect(res.body.errno).not.toBe(0)
}
)
