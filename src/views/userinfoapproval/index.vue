<template>
  <!--  <div>用户信息</div>-->
  <div class="wrapper">
    <div class="cx">
      <!-- <el-form :inline="true" class="demo-form-inline">
         <el-form-item class="form-item-select" label="单位名称：">
           <el-input v-model="searchForm.name"  placeholder="请输入单位名称"  clearable></el-input>
         </el-form-item>
         <el-form-item>
           <el-button type="goon" icon="el-icon-search" @click="querySubmit" size="medium">搜索</el-button>
         </el-form-item>
         <el-form-item>
           <el-button   icon="el-icon-refresh-right" @click="beginAdd" size="medium">重置查询条件</el-button>
         </el-form-item>
       </el-form>-->
    </div>
    <div class="biaoge">
      <el-table
        :data="list"
        border
        :header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}">
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
<!--        <el-table-column prop="unitname" label="单位名称" align="center" width="190" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="userrole" label="用户角色" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-user-solid" v-if="scope.row.userrole === 1">高级管理员</el-button>
            <el-button type="text" icon="el-icon-s-promotion" v-else-if="scope.row.userrole === 2" style="color: green">巡检人员</el-button>
            <el-button type="text" icon="el-icon-office-building" v-else-if="scope.row.userrole === 3" style="color: darkblue">地区代理</el-button>
            <el-button type="text" icon="el-icon-sell" v-else-if="scope.row.userrole === 4" style="color: red" >销售/商务人员</el-button>
            <el-button type="text" icon="el-icon-user" v-else-if="scope.row.userrole === 5" style="color: sandybrown">售后人员</el-button>
            <el-button type="text" icon="el-icon-link" v-else style="color: blueviolet">暂无角色</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="微信唯一标识" align="center" max-width="230" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="70"></el-table-column>
        <el-table-column prop="username" label="用户名" align="center" width="100"></el-table-column>
        <el-table-column prop="tel" label="联系电话" align="center" width="100"></el-table-column>
<!--        <el-table-column prop="idno" label="身份证明号码" align="center" width="150"></el-table-column>-->
        <el-table-column prop="disable" label="状态" align="center" width="100">
          <template slot-scope="scope">
            <div v-if=" scope.row.disable === 2">
              <el-popover placement="top" trigger="hover" >
                <div class="look" v-if="scope.row.note == '' || scope.row.note == null">
                  审核失败原因：无
                </div>
                <div class="look" v-else>
                  审核失败原因：{{ scope.row.note  }}
                </div>
                <el-tag slot="reference"  type="danger">审核不通过</el-tag>
              </el-popover>
            </div>
            <div v-else-if="scope.row.disable === 0">
              <el-tag  type="success">通过审核</el-tag>
            </div>
            <div v-else>
              <el-tag  type="warning">待审核</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="addtime" label="注册时间"  align="center" width="140" ></el-table-column>
<!--        <el-table-column prop="updatetime" label="更新时间"  align="center" width="140" ></el-table-column>-->
        <!--        <el-table-column prop="adduserid" label="注册人" align="center" ></el-table-column>-->
        <el-table-column prop="note" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit-outline" type="derive" @click="audit(scope.row)" >审核</el-button>
            <!--     :disabled="scope.row.disable == 0"       -->
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
        title="用户审核"
        width="710px"
      >
        <div class="zuo" style="width: 40%;float: left;">
          <div style="margin-bottom: 50px">用户角色 ：
            <el-button type="text" icon="el-icon-user-solid" v-if="editDialog.models.userrole === 1">高级管理员</el-button>
            <el-button type="text" icon="el-icon-s-promotion" v-else-if="editDialog.models.userrole === 2" style="color: green">巡检人员</el-button>
            <el-button type="text" icon="el-icon-office-building" v-else-if="editDialog.models.userrole === 3" style="color: darkblue">地区代理</el-button>
            <el-button type="text" icon="el-icon-sell" v-else-if="editDialog.models.userrole === 4" style="color: red" >销售/商务人员</el-button>
            <el-button type="text" icon="el-icon-sell" v-else-if="editDialog.models.userrole === 5" style="color: sandybrown" >售后人员</el-button>
            <el-button type="text" icon="el-icon-link" v-else style="color: blueviolet">暂无角色</el-button>
          </div>
          <div style="margin-bottom: 50px">姓名 ： {{editDialog.models.name}}</div>
          <div style="margin-bottom: 50px">用户名 ： {{editDialog.models.username}}</div>

        </div>
        <div class="you" style="width: calc(60% - 10px);float: left;margin-left: 10px">
          <div style="display: flex">
            该用户所属单位：
            <el-select
              v-model="editDialog.model.unitname"
              placeholder="请选择所属单位"
              @change="selectUnitName5"
              clearable filterable remote
              reserve-keyword
              :remote-method="remoteMethod"
              :loading="loading"
              @visible-change="visibles">
              <el-option v-for="item in util" :key="item.index" :label="item.unitname" :value="item.unitid"></el-option>
            </el-select>
          </div>
          <div style="margin-bottom: 30px;">
            <span style="color: red">注 : 审核时请选择该用户所属单位</span>
          </div>
          <div style="margin-bottom: 50px">注册时间 ： {{editDialog.models.addtime}}</div>
          <div style="margin-bottom: 50px">联系电话 ： {{editDialog.models.tel}}</div>
        </div>
        <div class="clearfix"></div>
        <!--编辑对话框底部按钮-->
        <div  style="text-align: center;">
          <!--          -->
          <el-button type="primary" icon="el-icon-check" @click="save">通过</el-button>
          <el-button icon="el-icon-close" @click="save1" type="danger">不予通过</el-button>
        </div>
        <div style="text-align: center;margin-top: 20px" v-if="editDialog.state" class="yuanyin">
          <el-form
            :model="editDialog.model"
            :rules="editDialog.rules"
            label-width="100px"
            ref="form"
          >
            <el-form-item label="原因：" prop="note">
              <el-input placeholder="请输入不通过原因" v-model="editDialog.model.note"></el-input>
            </el-form-item>
            <el-button type="info" @click="bytg">确定原因</el-button>
          </el-form>
        </div>

      </el-dialog>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import { sysUsergetReview,sysUserreview } from '@/Api/admin.js'
  import { getAllUnitList } from '@/Api/unit.js'
  export default {
    name: 'index',
    data() {
      return {
        // 密码保存
        searchForm: {name: ''},
        list: [],
        // 总条数     页数      每页的条数
        pagination: { total: 0, pageNo: 1, length: 8 },
        editDialog: {
          isShow: false,
          state:false,
          // 用户审核 数据
          models:{
            unitname:'',
            userrole:'',
            name:'',
            username:'',
            tel:'',
            idno:'',
            addtime:'',
            updatetime:'',
            adduserid:'',
            note:'',
          },
          // 审核信息 上传
          model: {
            id: null,
            note:'',
            disable:null,
            unitname:'',
            unitid:null,
          },
          rules:{
            note: [ { required: true, message: "原因不能为空", trigger: "blur"} ],
          }
        },
        util:[],
        options:[],
        // 没有选择用户单位时显示
        tgxx:false,
        loading:false,
      }
    },
    methods: {
      // 请求数据
      _getData(){
        let that = this;
        sysUsergetReview({
          length: that.pagination.length,
          pageNo: that.pagination.pageNo,
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
              // console.log(response)
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 获取单位信息数据
      _getUtilData(query){
        let that = this;
        that.util = []
        getAllUnitList({
          unittype:'',
          unitname:query,
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              let obj = {}
              for (let i =0;i<response.data.data.length;i++){
                obj = {};
                obj.index = response.data.data[i].unitid;
                obj.unitname = response.data.data[i].unitname;
                obj.unitid = response.data.data[i].unitid;
                that.util.push(obj)
              }
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 搜索 - 弹窗条件 - 单位
      remoteMethod(query){
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this._getUtilData(query)
          },200)
        } else {
          this.util = [];
        }
      },
      // 搜索 - 弹窗条件 - 不选择时
      visibles(val){
        if (val == false){
          this.util = [];
        }
      },
      // 查询按钮
      querySubmit(){},
      // 重置按钮
      beginAdd(){
        let that = this
        that.searchForm.name = ''
        that.querySubmitForm = Object.assign({}, this.searchForm);
        that._getData()
      },
      // 审核按钮
      audit(row){
        // console.log(row,3333)
        this.editDialog.isShow = true;
        this.editDialog.model.id = row.userid;

        this.editDialog.models.unitname = row.unitname;
        this.editDialog.model.unitname = row.unitname;
        this.editDialog.models.userrole = row.userrole;
        this.editDialog.models.name = row.name;
        this.editDialog.models.username = row.username;
        this.editDialog.models.tel = row.tel;
        this.editDialog.models.idno = row.idno;
        this.editDialog.models.addtime = row.addtime;
        this.editDialog.models.updatetime = row.updatetime;
        this.editDialog.models.adduserid = row.adduserid;
        this.editDialog.models.unitid = row.unitid;
        this.editDialog.models.note = row.note;
        this.editDialog.model.note = row.note;
      },
      // 审核 通过
      save(){
        let that = this
        that.editDialog.model.disable = 0
        that.editDialog.state = false;
        if (that.editDialog.model.unitname == ''){
          that.tgxx = true
        }else {
          sysUserreview({
            userid:that.editDialog.model.id,
            username:that.editDialog.models.username,
            disable:that.editDialog.model.disable,
            note:that.editDialog.model.note,
            unitid:that.editDialog.model.unitid,
            unitname:that.editDialog.model.unitname,
          })
            .then(function(response) {
              if (response.data.code === 20000) {
                that.editDialog.isShow = false;
                that.$message({
                  type: "success",
                  message: "审核成功"
                });
                that._getData();
              }
            })
            .catch(function(error) {
              console.log(error, "报错信息");
            });
        }

      },
      // 不通过 弹窗
      save1(){
        this.editDialog.model.disable = 2
        this.editDialog.state = true;
      },
      // 保存不通过原因
      bytg(){
        let that = this
        that.$refs.form
          .validate()
          .then(() => {
            sysUserreview({
              userid:that.editDialog.model.id,
              username:that.editDialog.models.username,
              disable:that.editDialog.model.disable,
              note:that.editDialog.model.note,
              unitid:that.editDialog.model.unitid,
              unitname:that.editDialog.model.unitname,
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  that.editDialog.isShow = false;
                  that.$message({
                    type: 'warning',
                    message: "不予通过"
                  });
                  that._getData();
                  // console.log(response)
                }
              })
              .catch(function(error) {
                console.log(error, "报错信息");
              });
          })
          .catch(() => {});
      },
      // 切换单位信息  弹窗  审核成功
      selectUnitName5(val){
        // console.log(val,'选中的')
        if(val == null || val == '') return
        else {
          let obj = {};
          obj = this.util.find(item => {
            return item.unitid === val;
            // console.log(obj,6666)
          });

          this.editDialog.model.unitname = obj.unitname;
          this.editDialog.model.unitid = obj.unitid;

        }
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
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.editDialog.model.note = '';
          this.editDialog.model.id = null;
          this.editDialog.models.username = '';
          this.editDialog.models.tel = '';
          this.editDialog.models.name = '';
          this.editDialog.models.idcardno = '';
          this.editDialog.model.unitname = '';
          this.editDialog.model.unitid = null;
          this.tgxx = false;

          if (this.editDialog.state == true){
            this.$refs.form.resetFields();
          }
          this.editDialog.state = false;
        }
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
  .cx{ height: 69px }

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
