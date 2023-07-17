/**
 * @description test demo
 */

function sum(a, b) {
    return a + b
}


test('test demo 1', () => {
    const num = sum(1, 2)
    expect(num).toBe(3)
}
)
