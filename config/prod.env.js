'use strict'
module.exports = {
  // 生产环境
  // 打包环境
  NODE_ENV: '"production"',
  // BASE_API: '"http://192.168.8.43:8084/patrol/"'      // 刘尧胜 ip
  // BASE_API: '"http://192.168.8.93:8084/patrol/"'      // 刘怀杰 ip
  BASE_API: '"http://www.robotown.net/patrol/"'      // 正式 ip
}
// 执行npm run build打包的时候则调用的是 BASE_API 这个
