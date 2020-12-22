<template>
  <!--  <div>用户信息</div>-->
  <div class="wrapper">
    <div class="cx">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item class="form-item-select" label="巡检人：">
          <el-input v-model="searchForm.name"  placeholder="请输入巡检人"  clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="goon" icon="el-icon-search" @click="querySubmit" size="medium">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button   icon="el-icon-refresh-right" @click="beginAdd" size="medium">重置查询条件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="biaoge">
      <el-table
        :data="list"
        border
        :header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}">
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="locationname" label="巡检地点" align="center" min-width="100">
          <template slot-scope="scope">
            <el-popover placement="top" trigger="hover" >
              <div class="look" v-if="scope.row.location == '' || scope.row.location == null">
                经纬度：无
              </div>
              <div class="look" v-else>
                经度：
                <p>
                  {{ scope.row.location | jd}}
                </p>
                纬度：
                <p>
                  {{ scope.row.location | wd}}
                </p>
              </div>
              <el-tag slot="reference"  >{{scope.row.locationname}}</el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="巡检人员姓名" align="center" min-width="100"></el-table-column>
        <el-table-column prop="result" label="巡检结果" align="center" min-width="100">
          <template slot-scope="scope">
            <el-button type="text"  v-if="scope.row.result === 0" icon="el-icon-link" style="color: green">合格</el-button>
            <el-button type="text" v-else icon="el-icon-connection" style="color: red">不合格</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="month" label="巡检月份"  align="center" min-width="100" >
          <template slot-scope="scope">
            第 {{scope.row.month}} 月
          </template>
        </el-table-column>
        <el-table-column prop="addtime" label="巡检时间"  align="center" width="150" ></el-table-column>
        <el-table-column prop="note" label="巡检说明"  align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="130">
          <template slot-scope="scope">
            <el-button  size="mini" icon="el-icon-tickets" type="info" @click="beginLock(scope.row)">详情信息</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="fenye">
      <el-pagination
        background
        @size-change="sizeChangeHandler"
        @current-change="currentChangeHandler"
        :current-page="pagination.pageNo"
        :page-sizes="[6, 8, 10, 20, 30, 40]"
        :page-size="pagination.length"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>
    <div class="tanchuang">
      <el-dialog
        class="dialog-edit"
        :visible.sync="editDialog.isShow"
        title="巡检信息"
        width="1300px"
        top="5vh">
        <div class="tanchuang">
          <el-card class="box-card">
            <div class="biaoti-wrapper">
              <div  class="biaoti">
                <h3>巡检地点：
                  <el-tag slot="reference">{{editDialog.locationname}}</el-tag>
                </h3>
                <h3>巡检时间：{{editDialog.addtime | sjians}}</h3>
              </div>
              <div  class="biaoti" style="margin-top: 5px">
                <h3>巡检人：{{editDialog.name}}

                </h3>
                <h3>巡检月份：{{editDialog.month | yuefen}}</h3>
              </div>
            </div>
            <div class="sheb-wrapper1 ">
              <div v-if="xq.data == [] || xq.data == null || xq.data == '' " class="zc-xx">
                <div style="display: flex">
                  软件情况：
                  <el-switch
                    style="display: block"
                    v-model="editDialog.value"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="正常"
                    inactive-text="异常"
                    disabled>
                  </el-switch>
                </div>
                <div style="display: flex">
                  硬件情况：
                  <el-switch
                    style="display: block"
                    v-model="editDialog.value1"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="正常"
                    inactive-text="异常"
                    disabled>
                  </el-switch>
                </div>
                <div style="display: flex">
                  环境情况：
                  <el-switch
                    style="display: block"
                    v-model="editDialog.scene"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="正常"
                    inactive-text="异常"
                    disabled>
                  </el-switch>
                </div>
                <div style="display: flex">
                  网络情况：
                  <el-switch
                    style="display: block"
                    v-model="editDialog.network"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="正常"
                    inactive-text="异常"
                    disabled>
                  </el-switch>
                </div>
                <div style="display: flex">
                  业务情况：
                  <el-switch
                    style="display: block"
                    v-model="editDialog.bussiness"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="正常"
                    inactive-text="异常"
                    disabled>
                  </el-switch>
                </div>
                <div style="display: flex">
                  备注：
                  <el-input
                    readonly
                    style="width: 80%"
                    type="textarea"
                    :rows="6"
                    v-model="editDialog.note">
                  </el-input>
                </div>
              </div>
              <div class="wrapper-sehb" v-else>
                <div class="sheb-wrapper ">
                  <div v-for="item in xq.data" class="sheb-xx">
                    <div class="sheb-bh" style="margin-left: 10px;">
                      设备编号：
                      <el-tag type="success">{{item.deviceno}}</el-tag>
                    </div>
                    <div class="sheb-rjian" style="display: flex;margin-left: 10px;">
                      软件情况：
                      <span v-if="item.softwaremsg == [] ||item.softwaremsg == '' ">
                        <p style="color: green">
                          正常
                        </p>
                      </span>
                      <span v-else>
                         <p v-for="(item2,i) in item.softwaremsg">
                          {{i+1}} - {{item2}}
                        </p>
                      </span>
                    </div>
                    <div class="sheb-yingjian" style="display: flex;margin-left: 10px;">
                      硬件情况：
                       <span v-if="item.hardwaremsg == [] ||item.hardwaremsg == '' ">
                         <p style="color: green">
                            正常
                         </p>
                      </span>
                      <span v-else>
                        <p v-for="(item2,i) in item.hardwaremsg">
                          {{i+1}} - {{item2}}
                        </p>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="yc-xx">
                  <div style="display: flex">
                    环境情况：
                    <el-switch
                      style="display: block"
                      v-model="editDialog.scene"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="正常"
                      inactive-text="异常"
                      disabled>
                    </el-switch>
                  </div>
                  <div style="display: flex">
                    网络情况：
                    <el-switch
                      style="display: block"
                      v-model="editDialog.network"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="正常"
                      inactive-text="异常"
                      disabled>
                    </el-switch>
                  </div>
                  <div style="display: flex">
                    业务情况：
                    <el-switch
                      style="display: block"
                      v-model="editDialog.bussiness"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-text="正常"
                      inactive-text="异常"
                      disabled>
                    </el-switch>
                  </div>
                  <div style="display: flex">
                    备注：
                    <el-input
                      readonly
                      style="width: 80%"
                      type="textarea"
                      :rows="6"
                      v-model="editDialog.note">
                    </el-input>
                  </div>
                </div>
              </div>

            </div>
          </el-card>
          <el-card class="box-card1">
            <div><h3>巡检相关照片信息</h3></div>
            <div class="tup-xxx">
              <div class="zer-sb">
                <div style="text-align: center">
                  <h2>
                    相关负责人与设备合影
                  </h2>
                </div>
                <div v-if="xq.devicephoto == ''|| xq.devicephoto == null" class="tup" style="width: 100%;height: 100%">
                  <img src="./zw.jpg" width="80%" >
                </div>
                <div v-else  class="tup"style="margin-top: 20px" >
                  <viewer>
                    <img :src="xq.devicephoto" width="80%" >
                  </viewer>
                </div>
              </div>
              <div class="xc-hj">
                <div style="text-align: center">
                  <h2>设备环境照片</h2>
                </div>
                <div v-if="xq.scenephoto == ''|| xq.scenephoto == null"  class="tup" style="width: 100%;height: 100%">
                  <img src="./zw.jpg" alt="" height="80%" >
                </div>
                <div v-else  class="tup" style="margin-top: 20px">
                  <viewer>
                    <img :src="xq.scenephoto" width="80%">
                  </viewer>

                </div>
              </div>
            </div>


          </el-card>
        </div >

        <div style="text-align: center;" slot="footer">
          <el-button @click="editDialog.isShow = false" style="width: 150px" type="info" >返回</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import { schedule,patrol } from '@/Api/schedule.js'
  export default {
    name: 'index',
    data() {
      return {
        // 密码保存
        searchForm: { name:"" ,scheduleid:null},
        querySubmitForm: { name:"",scheduleid:null },
        list: [],
        // 巡检详情
        xq:[],
        // 总条数     页数      每页的条数
        pagination: { total: 0, pageNo: 1, length: 8 },
        editDialog: {
          isShow: false,
          gs:null,
          locationname:'',
          addtime:'',
          value:'',
          value1:'',
          scene:'',
          network:'',
          bussiness:'',
          note:'',
          name:'',
          month:'',

        },
        userid:localStorage.getItem("userid"),// 当前登陆用户id
        userrole:localStorage.getItem("userrole"),// 当前登陆用户id
      }
    },
    methods: {
      // 请求数据
      _getData(){
        let that = this;
        schedule({
          length: that.pagination.length,
          pageNo: that.pagination.pageNo,
          name:that.querySubmitForm.name,
          userid:that.userid,
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              if (response.data.data.length == 0){
                that.$message({
                  message: '暂无信息',
                  type: 'warning'
                });
              }
              that.list = response.data.data;
              that.pagination.total = response.data.recordsTotal;
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 巡检详情查询
      _getScheduleData(){
        let that = this;
        patrol({
          scheduleid:that.searchForm.scheduleid
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.xq = response.data.data;
              that.editDialog.gs = that.xq.data.length;
              that.editDialog.isShow = true
              if (that.xq.data.length == 0){
                that.editDialog.value = true
                that.editDialog.value1 = true
              }
              if (that.xq.bussiness == 0){
                that.editDialog.scene = true
              }
              else {
                that.editDialog.scene = false
              }

              if (that.xq.network == 0){
                that.editDialog.network = true
              }else {
                that.editDialog.network = false
              }

              if (that.xq.bussiness == 0){
                that.editDialog.bussiness = true
              }else {
                that.editDialog.bussiness = false
              }
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 查询按钮
      querySubmit(){
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this._getData()
      },
      // 重置按钮
      beginAdd(){
        let that = this
        that.searchForm.name = ''
        that.searchForm.deviceno = ''
        that.querySubmitForm = Object.assign({}, this.searchForm);
        that._getData()
      },
      // 查看图片
      beginLock(row){
       this.searchForm.scheduleid = row.scheduleid
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this._getScheduleData()
        this.editDialog.locationname = row.locationname
        this.editDialog.addtime = row.addtime
        this.editDialog.note = row.note
        this.editDialog.name = row.name
        this.editDialog.month = row.month
      },


      // 换每页条数
      sizeChangeHandler(length) {
        this.pagination.length = length;
        this._getData();
      },
      // 换页
      currentChangeHandler(pageNo) {
        this.pagination.pageNo = pageNo;
        this._getData();
      },


    },
    watch: {},
    //存放 过滤器
    filters: {
      sjian(val){
          // console.log(val[1])
          return val[0] +'-'+ val[1].toString().padStart(2,'0')+'-'+val[2].toString().padStart(2,'0')+' '+val[3].toString().padStart(2,'0')+':'+val[4].toString().padStart(2,'0')+':'+val[5].toString().padStart(2,'0')
      },
      jd(val){
        return val.split(",")[0]
      },
      wd(val){
        return val.split(",")[1]
      },
      yuefen(val){
        return '第'+' ' + val +' ' +'月'
      },
      sjians(val){
        return val.slice(0,val.indexOf(" "))
      }
    },
    created() {
      this._getData()
    },
  }
</script>

<style scoped>
  .wrapper{ width: 100%;height: 100%;background-color: #f0f0f0; }
  .demo-form-inline{ margin-left: 15px }
  .demo-form-inline>*{ padding-top: 15px;box-sizing: border-box }
  .fenye{ text-align: center }
  .tup{ display: flex;justify-content: center;align-items: center;text-align: center }
  .data-warrper{  display: flex;flex-wrap: wrap;justify-content:center;height: auto }
  .data-warrpers{ width: 40%;margin-right: 5px;margin-left: 5px; }
  /*.wrapper >>> .el-dialog{ height: 100%;margin:0 }*/
  .tanchuang{ display: flex;justify-content: center }
  /*.wrapper >>>  .el-dialog__body{ height: 70% }*/
  .box-card{ width: 435px;margin-right: 50px;}
  .box-card1{ width: calc(90% - 435px) }
  .wrapper >>> .el-card__body{ height: 600px }
  .biaoti{ display: flex;justify-content: space-around; }
  .sheb-xx{
    border: 3px solid #c0c4cc;height: 100px;font-size: 16px;
    display: flex;flex-direction: column;justify-content: space-around;
    margin-bottom: 5px
  }
  .sheb-wrapper{ height: 180px;overflow: auto;margin-top: 20px }
  .sheb-wrapper1{ height: 85%;margin-top: 20px; }
  .zc-xx{ display: flex;flex-direction: column;justify-content: space-around;height: 100% }
  .yc-xx{ height: calc(100% - 180px);display: flex;flex-direction: column;justify-content: space-around }
  .tup-xxx{ display: flex;justify-content: space-around;height: 80% }
  .xc-hj{ width: 50% }
  .zer-sb{ width: 50% }
  .wrapper-sehb{ height: 100% }
  .wrapper >>> .box-card1{ height: 500px }

  .wrapper >>> .el-table{ height: 660px }
  @media screen and (max-height: 860px) {
    .cx{ height: 60px;flex-shrink: 0; }
    .fenye{ height: 100px;flex-shrink: 0; }
    .wrapper >>> .el-table{ height: 500px;overflow: auto }
  }
  @media screen and (max-height: 760px) {
    .wrapper >>> .el-table{ height: 400px;overflow: auto }
  }

</style>
