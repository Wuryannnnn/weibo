/**
 * @description 数据格式化
 */

const { DEFAULT_PICTURE, PAGE_SIZE } = require('../conf/constant');
const { timeFormat } = require('../utils/dt');

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
    return list.map(_formatDBTime);
  }
  // 对象
  return _formatDBTime(list);
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


    