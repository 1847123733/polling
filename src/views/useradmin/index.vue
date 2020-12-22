<template>
<!--  <div>用户信息</div>-->
  <div class="wrapper">
    <div class="cx">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item class="form-item-select" label="用户名：">
          <el-input v-model="searchForm.username"  placeholder="请输入用户名"  clearable></el-input>
        </el-form-item>

        <el-form-item label="用户状态：" class="form-item-select">
          <el-select v-model="searchForm.disables" placeholder="请选择用户状态" @change="selectUnitName5" clearable>
            <el-option v-for="item in startss" :key="item.index" :label="item.label" :value="item.zt" ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="goon" icon="el-icon-search" @click="querySubmit" size="medium">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button   icon="el-icon-refresh-right" @click="beginAdd" size="medium">重置查询条件</el-button>
        </el-form-item>
        <el-form-item style="float: right;margin-right: 5%">
          <el-button type="primary"  icon="el-icon-plus" @click="beginAdds" size="medium">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="biaoge">
      <el-table
        :data="list"
        border
        :header-cell-style="{ background:'rgb(203,227,251)',color:'rgb(76,164,255)' }">
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="unitname" label="单位名称" align="center" max-width="190" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userrole" label="用户角色" align="center" width="120"
                         :filters="[{ text: '高级管理员', value: 1 },
                         { text: '巡检人员', value: 2 },
                         { text: '地区代理', value: 3 },
                         { text: '销售/商务人员', value: 4 },
                         { text: '售后人员', value: 5 }]"
                         :filter-method="filterTag"
                         filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-user-solid" v-if="scope.row.userrole === 1">高级管理员</el-button>
            <el-button type="text" icon="el-icon-s-promotion" v-else-if="scope.row.userrole === 2" style="color: green">巡检人员</el-button>
            <el-button type="text" icon="el-icon-office-building" v-else-if="scope.row.userrole === 3" style="color: darkblue">地区代理</el-button>
            <el-button type="text" icon="el-icon-sell" v-else-if="scope.row.userrole === 4" style="color: red" >销售/商务人员</el-button>
            <el-button type="text" icon="el-icon-user" v-else-if="scope.row.userrole === 5" style="color: sandybrown">售后人员</el-button>
            <el-button type="text" icon="el-icon-link" v-else style="color: blueviolet">暂无角色</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="openid" label="微信唯一标识" align="center" max-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="100">
          <template slot-scope="scope">
            <el-popover placement="top" trigger="hover" >
              <div class="look">
                <div>联系电话：{{scope.row.tel}}</div>
                <div>身份证明号码：
                  <span v-if="scope.row.idno == '' || scope.row.idno == null">暂无信息</span>
                  <span v-else>{{scope.row.idno}}</span>

                </div>
              </div>
              <el-tag slot="reference"  >{{scope.row.name}}</el-tag>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" align="center" max-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="disable" label="状态" align="center" width="90">
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
        <el-table-column prop="addtime" label="注册时间"  align="center" max-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updatetime" label="更新时间"  align="center" max-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="note" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-s-finance" type="warning" @click="binding(scope.row)" :disabled="scope.row.userrole != 4">绑定单位</el-button>
            <el-button size="mini" icon="el-icon-edit" type="amend" @click="beginUpdate(scope.row)" >修改</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="beginRemove(scope.row)">删除</el-button>
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
        :title="`用户 - ${ editDialog.mode ? '新增' : '修改' }`"
        width="650px">
        <!--用mode判断新增或修改，true表示新增，false表示修改-->
        <!--编辑对话框表单-->
        <el-form
          :model="editDialog.model"
          :rules="editDialog.rules"
          label-width="120px"
          ref="form"
        >
          <div style="float: left;width: calc(50% - 10px);margin-right: 10px">
            <el-form-item label="单位类型：" prop="unittype"  style="margin-bottom: 30px">
              <el-select v-model="editDialog.model.unittype" placeholder="请选择单位类型" @change="selectUnitName8" clearable>
                <el-option v-for="(item,i) in util" :key="i" :label="item.label" :value="item.index" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="姓名：" prop="name" style="margin-bottom: 30px">
              <el-input v-model="editDialog.model.name" placeholder="请输入姓名" ></el-input>
            </el-form-item>
            <el-form-item label="联系电话：" prop="tel" style="margin-bottom: 30px">
              <el-input v-model="editDialog.model.tel" placeholder="请输入联系电话"></el-input>
            </el-form-item>
            <el-form-item label="身份证明号码：" prop="idno" style="margin-bottom: 30px">
              <el-input v-model="editDialog.model.idno" placeholder="请输入身份证明号码"></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="note" style="margin-bottom: 30px">
              <el-input v-model="editDialog.model.note" placeholder="请输入备注"></el-input>
            </el-form-item>
          </div>
          <div style="float: left;width: 50%;">
            <el-form-item label="单位名称：" prop="unitname"  style="margin-bottom: 0px">
              <el-select v-model="editDialog.model.unitname" placeholder="请选择单位名称" @change="selectUnitName9" clearable :disabled="utilInfo.length == 0 ">
                <el-option v-for="(item,i) in utilInfo" :key="i" :label="item.unitname" :value="item.unitid" ></el-option>
              </el-select>
              <span style="color: red;" >注：请先选择单位类型</span>
<!--              <span style="display: block;height: 30px" v-else></span>-->
            </el-form-item>
            <el-form-item label="用户角色：" prop="userrole" style="margin-bottom: 30px">
              <el-select v-model="editDialog.model.userrole" placeholder="请选择用户角色" @change="selectUnitName7" clearable>
                <el-option v-for="item in juese" :key="item.index" :label="item.label" :value="item.index" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名：" prop="username" style="margin-bottom: 30px">
              <el-input v-model="editDialog.model.username" placeholder="请输入用户名" :disabled="!editDialog.mode" ></el-input>
            </el-form-item>

            <el-form-item label="用户状态：" prop="disable" style="margin-bottom: 30px" v-if="!editDialog.mode">
              <el-select v-model="editDialog.model.disable" placeholder="请选择用户状态" @change="selectUnitName6" clearable :disabled="!editDialog.mode">
                <el-option v-for="item in startss" :key="item.index" :label="item.label" :value="item.index" ></el-option>
              </el-select>
            </el-form-item>

          </div>
          <div class="clearfix"></div>
        </el-form>
        <!--编辑对话框底部按钮-->
        <div slot="footer">
          <el-button icon="el-icon-refresh-right"  @click="czsj">重置输入</el-button>
          <el-button icon="el-icon-check" type="primary" @click="save">保存</el-button>
          <el-button icon="el-icon-close" @click="editDialog.isShow = false"  type="info">取消</el-button>

        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="editDialog.isShows" :title="`用户-(${editDialog.models.name})-绑定单位`"
        width="700px" top="10vh">
        <div class="baocd">
          <div>
            <h5>已绑定的单位</h5>
          </div>
          <div class="bianhao1">
            <div v-if="hasbinds.length == 0" class="bianhao" style="color: red">
              <h3>该用户暂无绑定单位，请在下方添加相关单位</h3>
            </div>
            <div v-else class="bianhao">
              <el-tag
                v-cloak closable type="success" :key="tag.unitid"
                v-for="tag in hasbinds" :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag.unitname}}
              </el-tag>
            </div>
          </div>
          <div style="margin-top: 10px">绑定新的单位</div>
          <div class="cx1">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item class="form-item-select" >
                <el-input v-model="searchForms.unitname"  placeholder="请输入单位名称"  clearable></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="goon" icon="el-icon-search" @click="querySubmits" size="medium">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button   icon="el-icon-refresh-right" @click="beginAddss" size="medium">重置查询条件</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="xin-sheb">
            <el-transfer
              v-model="editDialog.models.unitname"
              :data="devices"
              :titles="['所有的单位', '添加的单位']"
              @mouseover.native="addTitle"
              @change="dataChoice"
            ></el-transfer>

          </div>
          <div class="feny">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="paginations.total"
              :current-page.sync="paginations.pageNo"
              :page-size="paginations.length"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </div>
        <!--编辑对话框底部按钮-->
        <div slot="footer">
          <el-button icon="el-icon-check" type="primary" @click="saves" v-show="editDialog.models.unitname.length != 0">保存</el-button>
          <el-button icon="el-icon-close" @click="editDialog.isShows = false"  type="info">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  // 导入封装的api 用户的
  import {
    sysUser,
    sysUseradd,
    sysUserupdate,
    sysUserdelete,
    saleuser,
    salecancel,
    saleadd
  } from '@/Api/admin.js'
  import { getAllUnitList,listpage } from '@/Api/unit.js'

  // 如果要映射的是子仓库
  import  { createNamespacedHelpers } from  'vuex';
  let { mapState } = createNamespacedHelpers('publics');

  export default {
    name: 'index',
    data() {
      return {
        // 密码保存
        searchForm: { username: '',disables:'' },
        searchForms:{ unitname:'' },
        // 查询
        querySubmitForm: { username: "",disables:''},
        querySubmitForms:{ unitname:'' },
        list: [],
        // 总条数     页数      每页的条数
        pagination: { total: 0, pageNo: 1, length: 8 },
        editDialog: {
          isShow: false,
          isShows:false,
          mode: true,
          id: 0,
          model: {
            unitname: "",
            userrole: "",
            name: "",
            username: "",
            tel: "",
            idno: "",
            disable: "",
            note: "",
            unitid: null,
            unittype:'',
            openid:""
          },
          models:{
            name:'',
            unitname:[],
            userid:null,
          },
          rules: {
            unitname: [
              { required: true, message: "单位名称不能为空", trigger: "blur" }
            ],
            unittype: [

            ],
            userrole: [
              { required: true, message: "用户角色不能为空", trigger: "blur" }
            ],
            name: [
              { required: true, message: "姓名不能为空", trigger: "blur" }
            ],
            username: [
              { required: true, message: "用户名不能为空", trigger: "blur" }
            ],
            tel: [
              {
                validator: (rule, value, callback) => {
                  if (value === "")  callback(new Error("手机号码不能为空"));
                  else if (!/^1[3456789]\d{9}$/.test(value))
                    callback(new Error("请输入正确的手机号码"));
                  else callback();
                },
                trigger: "blur",
                required: true,
              }
            ],
            idno: [
              {
                validator: (rule, value, callback) => {
                  if (value == "" || value == null)  { return  callback();}
                  else if (
                    !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(
                      value
                    )
                  )
                  {callback(new Error("请输入正确的身份证号"));}
                  else{
                    callback();
                  }
                },
                trigger: "blur",
                required: false,
              }
            ],
            disable: [
              { required: true, message: "用户状态不能为空", trigger: "blur" }
            ],

          }
        },
        // 单位信息  - 所有的单位信息
        utilInfo:[],
        device:[],
        // 已经保存的单位  用户（销售） - 绑定 - 单位
        hasbind:[],
        paginations: { total: 0, pageNo: 1, length: 7 },
        userid:localStorage.getItem("userid"),// 当前登陆用户的角色
      }
    },
    computed:{
      ...mapState(['util']),          // 将 publics 仓库中的 util 映射到当时组件的计算属性中
      ...mapState(['startss']),          // 将 publics 仓库中的 startss 映射到当时组件的计算属性中
      ...mapState(['juese']),          // 将 publics 仓库中的 juese 映射到当时组件的计算属性中
      // 销售用户已经有的
      hasbinds(){
        let arr = [];
        for (let i = 0; i<this.hasbind.length;i++){
          let  shuju = {};
          shuju.unitid = this.hasbind[i].unitid
          shuju.unitname = this.hasbind[i].unitname
          arr.push(shuju)
        }
        return arr
      },
      // 所有的设备  - 点位已经有的
      devices(){
        let arr = [];
        for (let i = 0; i < this.device.length;i++) {
          arr.push({
            key:this.device[i].unitid,
            label:this.device[i].unitname
          })
        }
        let arr1 = arr.filter((item,index) => {
          for (let i = 0; i<this.hasbinds.length; i++) {
            if (this.hasbinds[i].unitname.indexOf(item.label) <= -1){
              return item
            }
          }
        })
        return arr
      }
    },
    methods: {
      // 请求数据
      _getData(){
        let that = this;
        sysUser({
          length: that.pagination.length,
          pageNo: that.pagination.pageNo,
          username: that.querySubmitForm.username,
          disable: that.querySubmitForm.disables,
          userid: that.userid,
        })
          .then(response =>  {
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
      // 请求单位数据
      _getUtilData(){
        let that = this;
        getAllUnitList({
          unittype:that.editDialog.model.unittype
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.utilInfo = response.data.data;
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 请求单位数据
      _getutil(){
        let that = this;
        listpage({
          length:that.paginations.length,
          pageNo:that.paginations.pageNo,
          userid:that.userid,
          unitname:that.querySubmitForms.unitname,
          unittype:'',
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.device = response.data.data;
              that.paginations.total = response.data.recordsTotal;
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 请求销售人员负责的单位
      _getsaleuser(id){
        let that = this;
        saleuser({
          userid:id
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.hasbind = response.data.data;
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 弹窗文字溢出         用户绑定 单位
      addTitle(e) {
        //手动给鼠标划过的元素添加一个title
        let target_el = e.target;
        if (target_el.title) return;
        target_el.title = target_el.innerText;
      },
      // 弹窗 用户绑定 单位
      dataChoice(value,direction,movedkeys){
        console.log(value,direction,movedkeys,6666)
      },
      filterTag(value, row) {
        // console.log(value,row)
        return row.userrole === value;
      },
      // 查询按钮
      querySubmit(){
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this._getData()
      },
      // 查询按钮  -- 弹窗
      querySubmits(){
        this.querySubmitForms = Object.assign({}, this.searchForms);
        this._getutil()
      },
      // 重置按钮
      beginAdd(){
        let that = this
        that.searchForm.username = ''
        that.searchForm.disables = ''
        that.querySubmitForm = Object.assign({}, this.searchForm);
        that._getData()
      },
      beginAddss(){
        this.searchForms.unitname = '';
        this.querySubmitForms = Object.assign({}, this.searchForms);
        this._getutil()
      },
      // 保存用户绑定单位
      saves(){
        let that = this;
        let unitid = that.editDialog.models.unitname.join(',');
        saleadd({
          userid: that.editDialog.models.userid,
          unitid
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.$message({
                type: "success",
                message: response.data.message,
              });
              that.editDialog.models.unitname = [];
              that._getsaleuser(that.editDialog.models.userid);
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 绑定单位
      binding(row){
        let that = this;
        that.editDialog.isShows = true;
        that.editDialog.models.name = row.name;
        that.editDialog.models.userid = row.userid;
        that._getsaleuser(row.userid);
        that._getutil();
      },
      // 删除用户绑定的单位
      handleClose(label){
        // console.log(typeof (label),3333)
        this.$confirm(`确定要删除与用户（${this.editDialog.models.name}）相关的单位名称为 ‘ ${label.unitname} ’ 吗？`, "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            salecancel({
              userid: that.editDialog.models.userid,
              unitid: label.unitid
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  that.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  that.hasbind.splice(that.hasbinds.indexOf(label), 1);
                  that._getsaleuser(that.editDialog.models.userid);
                }
              })
              .catch(function(error) {
                console.log(error, "报错信息");
              });
          })
          .catch(() => {});
      },
      // 新增按钮
      beginAdds(){
        this.editDialog.mode = true;
        this.editDialog.isShow = true;
      },
      // 编辑
      beginUpdate(row){
        // console.log(row,222)
        this.editDialog.mode = false;
        this.editDialog.isShow = true;

        this.editDialog.id = row.userid;
        this.editDialog.model.unitname = row.unitname;
        this.editDialog.model.unitid = row.unitid;
        this.editDialog.model.userrole = row.userrole;
        this.editDialog.model.openid = row.openid;
        this.editDialog.model.name = row.name;
        this.editDialog.model.username = row.username;
        this.editDialog.model.tel = row.tel;
        this.editDialog.model.idno = row.idno;
        this.editDialog.model.disable = row.disable;
        this.editDialog.model.note = row.note;

      },
      // 保存  编辑 - 修改
      save(){
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this;
              sysUseradd({
                unitid:that.editDialog.model.unitid,
                unitname:that.editDialog.model.unitname,
                userrole:that.editDialog.model.userrole,
                openid:that.editDialog.model.openid,
                name:that.editDialog.model.name,
                username:that.editDialog.model.username,
                tel:that.editDialog.model.tel,
                idno:that.editDialog.model.idno,
                disable:that.editDialog.model.disable,
                note:that.editDialog.model.note,
              })
                .then(function(response) {
                  if (response.data.code === 20000) {
                    // console.log(response)
                    that.editDialog.isShow = false;
                    // console.log(response)
                    that.$message({
                      showClose: true,
                      duration:0,
                      type: "success",
                      message: response.data.message,

                    });
                    that._getData();
                  }
                })
                .catch(function(error) {
                  console.log(error, "报错信息");
                });
            }
            else {
              // 修改
              let that = this;
              sysUserupdate({
                unitid:that.editDialog.model.unitid,
                unitname:that.editDialog.model.unitname,
                userid: that.editDialog.id,
                userrole:that.editDialog.model.userrole,
                name:that.editDialog.model.name,
                username:that.editDialog.model.username,
                tel:that.editDialog.model.tel,
                idno:that.editDialog.model.idno,
                disable:that.editDialog.model.disable,
                note:that.editDialog.model.note,
              })
                .then(function(response) {
                  if (response.data.code === 20000) {
                    that.editDialog.isShow = false;
                    that.$message({
                      type: "success",
                      message: "修改成功"
                    });
                    that._getData();
                  }
                })
                .catch(function(error) {
                  console.log(error, "报错信息");
                });
            }
          })
          .catch(() => {});
      },
      // 删除
      beginRemove(row){
        // console.log(row,3333)
        this.$confirm(`确定要删除账号为 ‘ ${row.username} ’ 吗？`, "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            sysUserdelete({
              userid:row.userid,
              username:row.username
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  that.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  that._getData();
                }
              })
              .catch(function(error) {
                console.log(error, "报错信息");
              });

          })
          .catch(() => {});
      },
      // 切换用户状态选项  条件
      selectUnitName5(val){
        // console.log(val,'选中的')
        if(val == null || val == '') return
        else {
          let obj = {};
          obj = this.startss.find(item => {
            return item.zt === val;
          });
          this.searchForm.disable = obj.zt;
          // console.log(typeof(this.searchForm.disable))
        }
      },
      // 切换用户状态选项  弹窗
      selectUnitName6(val){
        if(val == null || val == '') return
        else {
          let obj = {};
          obj = this.startss.find(item => {
            return item.zt === val;
          });
          this.editDialog.model.disable = obj.zt;
          // console.log(typeof(this.searchForm.disable))
        }
      },
      // 切换用户角色  弹窗
      selectUnitName7(val){
        if(val == null || val == '') return
        else {
          let obj = {};
          obj = this.juese.find(item => {
            return item.index === val;
          });
          this.editDialog.model.userrole = obj.index;
          // console.log(typeof(this.searchForm.disable))
        }
      },
      // 切换单位类型 弹窗
      selectUnitName8(val){
        // console.log(val)
        this.utilInfo = [];
        this.editDialog.model.unitname = "";
        if(val == null || val == '') return
        else {
          this.editDialog.model.unittype = val;
          this._getUtilData()
        }
      },
      // 切换单位名称  数据在单位类型改变 改变
      selectUnitName9(val){
        // console.log(val,233323222)
        if(val == null || val == '') return
        else {
          let obj = {};
          obj = this.utilInfo.find(item => {
            return item.unitid === val;
          });
          this.editDialog.model.unitname = obj.unitname
          this.editDialog.model.unitid = obj.unitid
        }
      },
      // 重置数据  按钮
      czsj(){
        this.editDialog.model.unitname = '';
        this.editDialog.model.userrole = '';
        this.editDialog.model.openid = '';
        this.editDialog.model.name = '';
        this.editDialog.model.username = '';
        this.editDialog.model.tel = '';
        this.editDialog.model.idno = '';
        this.editDialog.model.disable = '';
        this.editDialog.model.note = '';
        this.utilInfo = [];
        this.$refs.form.resetFields();
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
      // 每页多少条
      handleSizeChange(length) {
        this.paginations.length = length;
        this._getutil()
      },
      // 当前第几页
      handleCurrentChange(pageNo) {
        this.paginations.pageNo = pageNo;
        this._getutil()
      },
    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();
          this.editDialog.id = 0;
          this.editDialog.model.unitname = '';
          this.editDialog.model.userrole = '';
          this.editDialog.model.openid = '';
          this.editDialog.model.name = '';
          this.editDialog.model.username = '';
          this.editDialog.model.tel = '';
          this.editDialog.model.idno = '';
          this.editDialog.model.disable = '';
          this.editDialog.model.note = '';
          this.editDialog.model.unittype = '';
          this.utilInfo = [];
        }
      }
    },
    created() {
      this._getData()
      // this._getUtilData()
    },
  }
</script>

<style scoped>
  .wrapper{ width: 100%;height: 100%;background-color: #f0f0f0; }
  .demo-form-inline{ margin-left: 15px }
  .demo-form-inline>*{ padding-top: 15px;box-sizing: border-box }
  .fenye{ text-align: center; }
  .bianhao{
    height: 80px;display: flex;flex-wrap: wrap;
    overflow: auto;border: 1px dashed #c0c4cc;border-radius: 10px;
    padding: 10px;box-sizing: border-box;margin-top: 5px;
  }
  .bianhao>*{ margin-bottom: 10px;margin-right: 10px; }
  .xin-sheb{ padding: 10px;box-sizing: border-box }
  .wrapper >>> .el-transfer-panel{ width:210px }

  .wrapper >>> .el-table{ height: 660px }
  @media screen and (max-height: 860px) {
    .cx{ height: 60px;flex-shrink: 0; }
    .fenye{ height: 100px;flex-shrink: 0; }
    .wrapper >>> .el-table{ height: 500px;overflow: auto }
  }
  @media screen and (max-height: 760px) {
    .wrapper >>> .el-table{ height: 400px;overflow: auto }
  }
  @media screen and (max-height: 725px) {
    .wrapper >>> .el-table{ height: 300px;overflow: auto }
  }
</style>
