<template>
  <div id="app" >
    <router-view v-wechat-title='$route.meta.title'/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      _beforeUnload_time: "",
      _gap_time: "",
      screenWidth: document.body.clientWidth, // 屏幕尺寸 宽
      screenHeight: document.body.clientHeight, // 屏幕尺寸 高
    };
  },
  methods: {
    beforeunloadHandler() {
      this._beforeUnload_time = new Date().getTime();
    },
    unloadHandler(e) {
      this._gap_time = new Date().getTime() - this._beforeUnload_time;
      console.log(this._gap_time);

      //判断是窗口关闭还是刷新  要发送同步请求
      if (this._gap_time <= 5) {
        //关闭X
        // localStorage.removeItem("id");
        // localStorage.removeItem("menus");
        // localStorage.removeItem("menuRouter");
        // localStorage.removeItem("rolesId");
        // localStorage.removeItem("units");
        // localStorage.removeItem("username");
        // debugger
        localStorage.clear();
      }
    },

  },
  destroyed() {
    window.removeEventListener("beforeunload", e =>
      this.beforeunloadHandler(e)
    );
    window.removeEventListener("unload", e => this.unloadHandler(e));
  },
  mounted() {
    const that = this
    //监听页面是否关闭
    window.addEventListener("beforeunload", e =>
      that.beforeunloadHandler(e)
    );
    window.addEventListener("unload", e => that.unloadHandler(e));


    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
        window.screenHeight = document.body.clientHeight
        that.screenHeight = window.screenHeight
      })()
    }

  //是window的事件，只能绑定一次，对于VUE单页面来说 最好这个写在APP页面，
    // 这样只要这个事件触发，就可以通过this.$refs找到其他组件，触发其中的 适应屏幕的内容
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;height: 100%;
}



</style>
