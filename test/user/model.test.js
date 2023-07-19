/**
 * @description user model test
 */

const { User } = require('../../src/db/model/Index')

test('User model property test', () => {
    const user = User.build({
        userName: 'zhangsan',
        password: '123',
        nickName: '张三',
        picture: '/xxx.png',
        city: '北京'
    })
    expect(user.userName).toBe('zhangsan')
    expect(user.password).toBe('123')
    expect(user.nickName).toBe('张三')
    expect(user.picture).toBe('/xxx.png')
    expect(user.city).toBe('北京')
})