/**
 * @description 首页 test
 */

const server = require('../server')
const { COOKIE } = require('../testUserInfo')

let BLOG_ID = '';

test('首页，加载第一页数据，应该成功', async () => {
    const content = '单元测试自动创建的微博_' + Date.now();
    const image = '/test.png';

    // 创建一条微博
    const res = await server.post('/api/blog/create').send({
        content,
        image
    }).set('cookie', COOKIE);
    expect(res.body.errno).toBe(0);
    expect(res.body.data.content).toBe(content);
    expect(res.body.data.image).toBe(image);

    // 记录微博 id
    BLOG_ID = res.body.data.id;
})
