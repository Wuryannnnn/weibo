/**
 * @description 数据格式化
 */

const { DEFAULT_PICTURE, PAGE_SIZE } = require('../conf/constant');
const { timeFormat } = require('../utils/dt');
const { REG_FOR_AT_WHO } = require('../conf/constant');

function _formatUserPicture(obj) {
  if (obj.picture == null) {
    obj.picture = DEFAULT_PICTURE;
  }

  return obj;
}

function _formatDBTime(obj) {
  obj.createdAtFormat = timeFormat(obj.createdAt);
  obj.updatedAtFormat = timeFormat(obj.updatedAt);
  return obj;
}

/**
 * 格式化微博内容
 * @param {Object} obj 微博数据对象
 * @returns {Object} 格式化后的数据
 * 
 */
function _formatContent(obj) {
  obj.contentFormat = obj.content;

  // 格式化 @
  obj.contentFormat = obj.contentFormat.replace(
    REG_FOR_AT_WHO,
    (matchStr, nickName, userName) => {
      return `<a href="/profile/${userName}">@${nickName}</a>`;
    }
  );
    return obj;
}

/**
 * 
 * @param {Array|Object} list 
 * @returns 
 */

function formatBlog(list) {
  if(list == null) {
    return list;
  }
  if(list instanceof Array) {
    // 数组
    return list.map(_formatDBTime).map(_formatContent);
  }
  // 对象
  let result = list;
  result = _formatDBTime(result);
  result = _formatContent(result);
  return result;
}
/**
 * 格式化用户信息
 * @param {Array|Object} list 用户列表或单个用户对象
 * @return {Array|Object} 格式化后的用户列表或者单个用户对象
 */

function formatUser(list) {
  if (list == null) {
    return list;
  }
  if (list instanceof Array) {
    // 数组 用户列表
    return list.map(_formatUserPicture);
  } 
  // 单个对象
  return _formatUserPicture(list);
}

module.exports = {
  formatUser,
  formatBlog
};


    