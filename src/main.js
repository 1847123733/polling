// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
// 自定义 指令 用于
Vue.directive(
  'el-select-loadmore', {
    bind(el, binding) {
      // console.log(el,binding,666)
      let self = this
      // 获取element-ui定义好的scroll盒子
      const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap');
      SELECTWRAP_DOM.addEventListener('scroll', function () {
        /**
         * scrollHeight 获取元素内容高度(只读)
         * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
         * clientHeight 读取元素的可见高度(只读)
         * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
         * ele.scrollHeight - ele.scrollTop === ele.clientHeight;

         * 此时绑定事件的binding.value是一个表达式，此处为方法ceshi，
         若要传递字符串，则需要写“‘ceshi’”,这样传入的binding.value就是字符串’ceshi’了

         */
        const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
        if (condition) binding.value()

      });
    }
  }
)



import store from './store/index';

// 饿了么
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App'
import router from './router'
// 重置样式
import '../static/reset.css'
// 饿了么
Vue.use(ElementUI,{ size: 'small'},{ zIndex: 2000 });

// echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

// 网页标题
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)

// 高德 地图
import AMap from 'vue-amap';
Vue.use(AMap);
// 初始化vue-amap
AMap.initAMapApiLoader({
  // 高德key
  key: '34930e9667ca46b5d2e03d4a072a3b66',
  // 插件集合 （插件按需引入）
  plugin:['Geolocation', 'Geocoder','PlaceSearch'],
});

// 点击图片放大
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    toolbar: true
  } })
Viewer.setDefaults({
// 工具栏按钮的控制
  toolbar: {
    reset: 1, // 还原
    zoomIn:1, // 放大
    zoomOut: 1, // 缩小
    oneToOne: 0, // 100%大小
    prev: 0, // 上一张
    play: 0, // 全屏显示
    next: 0, // 下一张
    rotateLeft: 1, // 逆时针旋转
    rotateRight: 1, // 顺时针旋转
    flipHorizontal: 0, // 水平翻转
    flipVertical: 0 // 垂直翻转
  },
  ready: function (e) {
    console.log(e,'组件以初始化');
  },
})




Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
