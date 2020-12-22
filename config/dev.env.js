'use strict'
// 开发环境
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
// 先引入了webpack-merge这个模块。这个模块的作用是来合并两个配置文件对象并生成一个新的配置文件，有点儿类似于es6的object.assign();
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  // BASE_API: '"http://192.168.8.43:8084/patrol/"'      // 刘尧胜 ip
  BASE_API: '"http://192.168.8.93:8084/patrol/"'      // 刘怀杰 ip

  // BASE_API: '"http://www.robotown.net/patrol/"'         // 正式 ip
})
// 开发环境执行npm  run dev 的时候，就调用的是 BASE_API


