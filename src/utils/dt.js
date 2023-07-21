/**
 * @description 时间相关的工具函数
 */

const { format } = require('date-fns')

/**
 * 格式化时间，如 09.10 23:00
 * @param {string} str 时间字符串
 * @returns {string} 格式化后的字符串
 *
 */
function timeFormat(str) {
    return format(new Date(str), 'MM.dd HH:mm')
}

module.exports = {
    timeFormat
}
