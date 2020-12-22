<template>
  <div class="loginbg">
<!--    @keyup.enter="onSubmit"-->
    <div class="logincont" id="app" >
      <div class="loginbgimg">
        <img src="../../src/assets/login/bj.143c039.png" style="width: 290px;height: 370px;"/>
      </div>
      <div class="loginwarpbig">
        <div class="loginwarp">
          <div class="logintop clearfloat">
            <h2 class="loginh2 fl" >通产智能营销网络合作平台</h2>
            <img src="../../src/assets/login/toprt.png" class="loginimg fr"/>
          </div>
          <div class="logindown" >
            <el-form ref="form" :model="model" :rules="rules" status-icon>
              <el-form-item prop="username" >
                <el-input
                  placeholder="请输入用户名 / 账号"
                  v-model="model.username">
                  <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password" >
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  v-model="model.password">
                  <i slot="prefix" class="el-input__icon el-icon-edit"></i>
                </el-input>
              </el-form-item>

              <el-form-item style="margin-bottom: 10px;">
                <div class="subbtn">
                  <el-button type="primary" class="subbtn" @click="login">登录</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";
  import { addAdmin } from '@/Api/admin.js'
  import { showLoading, hideLoading } from "@/utils/loading.js";
  export default {
    name:'index',
    data(){
        return{
          model: {
            username: "",
            password: ""
          },
          rules: {
            username: [
              { required: true, message: "用户名 / 账号不能为空..", trigger: "blur" },
              { max: 20, min: 3, message: "账号长度3 - 20之间..", trigger: "blur" }
            ],
            password: [
              { required: true, message: "密码不能为空..", trigger: "blur"},
              { max: 20, min: 5, message: "账号长度5 - 20之间..", trigger: "blur"}
            ]
          }
        }
    },
      methods:{
        login() {
          this.$refs.form
            .validate()
            .then(flag => {
              // 前台输入验证成功
              if (flag) {
                showLoading()
                return addAdmin({...this.model})
                  .then(function(response) {
                    if (response.data.code === 20000) {
                      let username = response.data.data.username;
                      localStorage.setItem("username", username);
                      localStorage.setItem("menuRouter", "welcome");
                      localStorage.setItem("crumbs", "");
                      localStorage.setItem("userid", response.data.data.userid);

                      localStorage.setItem("addtime", response.data.data.addtime);
                      localStorage.setItem("disable", response.data.data.disable);
                      localStorage.setItem("idno", response.data.data.idno);
                      localStorage.setItem("tel", response.data.data.tel);
                      localStorage.setItem("unitname", response.data.data.unitname);
                      localStorage.setItem("name", response.data.data.name);
                      localStorage.setItem("userrole", response.data.data.userrole);
                      localStorage.setItem("unitid", response.data.data.unitid);
                    }
                  })
                  .catch(() => {
                    setTimeout(() => hideLoading(), 500);  // 延时500毫秒关闭loading
                  }); // 消除失败的promise在浏览中报的警告
              }
              // 验证失败
              else return new Promise(() => {});
            })
            .then(() => {
              this.$router.replace("/home");
            })
            .then(() => {
              setTimeout(() => hideLoading(), 500);  // 延时500毫秒关闭loading
            })
            .catch(() => {}); // 消除失败的promise在浏览中报的警告
        }
      },
      // 监听
      watch:{},
      created() {
        let that = this;
        document.onkeypress = function(e) {
          let keycode = document.all ? event.keyCode : e.which;
          if (keycode == 13) {
            that.login(); // 登录方法名
            return false;
          }
        };
        if(localStorage.getItem('userid')) {
          this.$router.replace("/home");
        }
      },

  }
</script>
<style scoped>
  @media screen and (max-width: 1280px) {
    .loginwarpbig{ height: 48%; }
    .loginbgimg{height: 47%;}
  }
  @media screen and (max-width: 1360px) {
    .loginwarpbig{height: 48%;}
    .loginbgimg{height: 47%;}
  }
  @media screen and (max-width: 1366px) {
    .loginwarpbig{height: 48%;}
    .loginbgimg{height: 47%;}
  }
  @media screen and (max-width: 1600px) {
    .loginwarpbig{height: 48%;}
    .loginbgimg{height: 47%;}
  }
  @media screen and (max-height: 1000px) {
    .loginwarpbig{height: 38%;}
    .loginbgimg{height: 43%;}
  }
  .loginbg{
    width:100%; height:100%;min-width: 1000px; min-height: 600px;
    background:url('../../src/assets/login/beijing.jpg') no-repeat top center; background-size: cover;
  }
  .loginbgimg{ margin-right: 15% }
  /*登录页样式*/
  .logincont{ width: 500px; margin: auto;display: flex;justify-content: center;height: 100%;align-items: center;}
  .loginwarpbig{  width:340px; }
  .loginwarp{ background:#fff; border-radius: 5px; box-shadow: 0px 5px 20px rgba(51,51,51,0.46); overflow: hidden;}
  .logintop{ width:100%; height:56px; background:#666; }
  .subbtn .el-button--primary{ background-color: #666; }
  .subbtn .el-button--primary:hover{ background: #777; }
  .loginh2{ margin-left:20px; line-height: 56px; font-size: 17px; color:#fff; font-weight: normal;letter-spacing:1px }
  .loginimg{ margin-right: 20px; margin-top: 10px;}
  .logindown{ padding:20px;height: 200px; }
  .el-form{ height: 100%; display: flex;flex-direction: column;justify-content: space-around }
  .subbtn{ width:100%;}
  .fl{ float:left; }
  .fr{ float:right;margin-right: 10px;}
  .loginbg >>> .el-input .el-input__suffix .el-icon-circle-check{ color: #006e54; }
</style>
