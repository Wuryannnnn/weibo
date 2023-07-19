/**
 * @description 数据格式化
 */

const { DEFAULT_PICTURE, PAGE_SIZE } = require('../conf/constant');

function _formatUserPicture(obj) {
  if (obj.picture == null) {
    obj.picture = DEFAULT_PICTURE;
  }

  return obj;
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
  formatUser
};


    