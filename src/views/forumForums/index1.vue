<template>
  <!--  <div>用户信息</div>-->
  <div class="wrapper">
    <div class="cx">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item class="form-item-select" label="论坛名称：">
          <el-input v-model="searchForm.forumName"  placeholder="请输入论坛名称"  clearable></el-input>
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
        :header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}" >
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="forumName" label="论坛名称" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="管理员名称" align="center" max-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="owner" label="所有人列表" align="center" max-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.owner | jiii}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitname" label="论坛所属单位名称" align="center" max-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="enabled" label="是否启用" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-switch
              style="display: block"
              v-model="scope.row.enabled == 1"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changes">
<!--              active-text="启用"-->
<!--              inactive-text="禁止"-->
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="210">
          <template slot-scope="scope">
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
        :title="`论坛 - ${ editDialog.mode ? '新增' : '修改' }`"
        width="600px">
        <!--用mode判断新增或修改，true表示新增，false表示修改-->
        <!--编辑对话框表单-->
        <div>
          <el-form
            :model="editDialog.model"
            :rules="editDialog.rules"
            label-width="110px"
            ref="form"
          >
            <div style="float: left;width: calc(50% - 10px);margin-right: 10px">
              <el-form-item label="论坛名称：" prop="forumName" style="margin-bottom: 30px">
                <el-input v-model="editDialog.model.forumName" placeholder="请输入论坛名称"></el-input>
              </el-form-item>
              <el-form-item label="人员列表：" prop="owner" style="margin-bottom: 30px">
                <el-select
                  v-model="editDialog.model.owner"
                  placeholder="请选择人员"
                  clearable filterable multiple
                  value-key="index">
                  <el-option v-for="item in user" :key="item.index" :label="item.owner" :value="item.userid"></el-option>
                </el-select>
              </el-form-item>

            </div>
            <div style="float: left;width: 50%;">
              <el-form-item label="所属单位：" prop="unitname" style="margin-bottom: 30px">
                <el-select
                  v-model="editDialog.model.unitname"
                  placeholder="请选择所属单位"
                  @change="selectUnitName"
                  clearable filterable >
                  <el-option v-for="item in util" :key="item.index" :label="item.unitname" :value="item.unitid"></el-option>
                </el-select>
<!--                <el-input v-model="editDialog.model.unitname" placeholder="请输入所属单位名称"></el-input>-->
              </el-form-item>
              <el-form-item label="备注：" prop="memo" style="margin-bottom: 30px">
                <el-input v-model="editDialog.model.memo" placeholder="请输入备注"></el-input>
              </el-form-item>

            </div>
            <div class="clearfix"></div>
          </el-form>
        </div>

        <!--编辑对话框底部按钮-->
        <div slot="footer">
          <el-button icon="el-icon-refresh-right"  @click="czsj" v-if="editDialog.mode">重置输入</el-button>
          <el-button icon="el-icon-check" type="primary" @click="save">保存</el-button>
          <el-button icon="el-icon-close" @click="editDialog.isShow = false"  type="info">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import { getAllUnitList } from '@/Api/unit.js'
  import { forumForums,forumForumsadd,forumForumsupdate,forumForumsdelete } from '@/Api/forum.js'
  import { sysUser } from '@/Api/admin.js'
  let that;
  export default {
    name: 'index',      // 论坛信息

    data() {
      return {
        // 密码保存
        searchForm: { forumName: ''},
        // 查询
        querySubmitForm: { forumName: ""},
        list: [],
        // 所有的用户
        user: [],
        // 所有的单位
        util: [],
        // 总条数     页数      每页的条数
        pagination: { total: 0, pageNo: 1, length: 8 },
        editDialog: {
          isShow: false,
          mode: true,
          model: {
            forumName:'',
            unitname:'',
            owner:'',
            memo:'',
            unitid:null,
            forumId:null,
          },
          rules: {
            forumName: [
              { required: true, message: "论坛名称不能为空", trigger: "blur" }
            ],
            unitname: [
              { required: true, message: "所属单位名称不能为空", trigger: "blur" }
            ],
            owner: [
              { required: true, message: "论坛人员不能为空", trigger: "blur" }
            ]
          }
        },
        // 单位名称
        utilname:[],
        userid:localStorage.getItem("userid"),// 当前登陆用户的角色
      }
    },
    methods: {
      // 请求数据
      _getData(){
        let that = this;
        forumForums({
          length: that.pagination.length,
          pageNo: that.pagination.pageNo,
          forumName:that.querySubmitForm.forumName,
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
      // 获取单位信息数据
      _getAllUnitList(){
        let that = this;
        getAllUnitList({
          unittype:'',
          unitname:'',
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
      // 获取用户信息
      _getUser(){
        let that = this;
        sysUser({
          length:20,
          pageNo:1,
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              let obj = {}
              for (let i =0;i<response.data.data.length;i++){
                obj = {};
                obj.index = response.data.data[i].userid;
                obj.owner = response.data.data[i].name;
                obj.userid = response.data.data[i].userid;
                that.user.push(obj)
              }
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 弹窗 单位 下拉选择
      selectUnitName(val){
        if(val == null || val == '') return
        else {
          let obj = {};
          obj = this.util.find(item => {
            return item.unitid === val;
          });
          this.editDialog.model.unitname = obj.unitname;
          this.editDialog.model.unitid = obj.unitid;
        }
      },

      // 查询按钮
      querySubmit(){
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this._getData()
      },
      // 重置按钮
      beginAdd(){
        let that = this
        that.searchForm.unittype = ''
        that.searchForm.unitname = ''
        that.querySubmitForm = Object.assign({}, this.searchForm);

        that._getData()
      },
      // 重置数据  按钮
      czsj(){
        this.editDialog.model.forumName = '';
        this.editDialog.model.unitname = '';
        this.editDialog.model.owner = [];
        this.editDialog.model.memo = '';
        this.editDialog.model.unitid = null;

        this.$refs.form.resetFields();
      },
      // 表格 是否启用 的按钮点击
      changes(val){
        // todo
        console.log(val,6666)
      },

      // 新增按钮
      beginAdds(){
        this.editDialog.mode = true;
        this.editDialog.isShow = true;
      },
      // 编辑
      beginUpdate(row){
        this.editDialog.mode = false;
        this.editDialog.isShow = true;

        this.editDialog.model.forumName = row.forumName;
        this.editDialog.model.unitname = row.unitname;

        this.editDialog.model.owner = row.owner.split(",").map(Number);
        this.editDialog.model.memo = row.memo;
        this.editDialog.model.unitid = row.unitid;
        this.editDialog.model.forumId = row.forumId;
      },
      // 保存  编辑 - 修改
      save(){
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this
              forumForumsadd({
                forumName:that.editDialog.model.forumName,
                userId:that.userid,
                unitid:that.editDialog.model.unitid,
                unitname:that.editDialog.model.unitname,
                owner:that.editDialog.model.owner.toString(),
                memo:that.editDialog.model.memo

              })
                .then(function(response) {
                  if (response.data.code === 20000) {
                    that.editDialog.isShow = false;
                    that.$message({
                      type: "success",
                      message: "新增成功"
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
              forumForumsupdate({
                forumId:that.editDialog.model.forumId,
                forumName:that.editDialog.model.forumName,
                userId:that.userid,
                unitid:that.editDialog.model.unitid,
                unitname:that.editDialog.model.unitname,
                owner:that.editDialog.model.owner.toString(),
                memo:that.editDialog.model.memo,
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
        this.$confirm(`确定要删除论坛名称为 ‘ ${row.forumName} ’ 吗？`, "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            forumForumsdelete({
              forumId:row.forumId
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
          this.$refs.form.resetFields();

          this.editDialog.model.forumName = '';
          this.editDialog.model.unitname = '';
          this.editDialog.model.owner = [];
          this.editDialog.model.memo = '';
          this.editDialog.model.unitid = null;
          this.editDialog.model.forumId = null;

        }
      }
    },
    filters:{
      jiii(val){
        let arr = that.user;
        let arr1 = val.split(',');
        let mingc = '';
        for (let i = 0 ; i< arr.length; i ++){
          for (let j = 0 ; j<arr1.length;j++){
            if (arr[i].userid == arr1[j]){
              mingc +=  arr[i].owner + '  '
            }
          }
        }
        return mingc
      }
    },
    created() {
      this._getData()
      this._getAllUnitList()
      this._getUser()
    },
    beforeCreate() {
      that = this;
    }
  }
</script>

<style scoped>
  .wrapper{ width: 100%;height: 100%;background-color: #f0f0f0; }
  .demo-form-inline{ margin-left: 15px }
  .demo-form-inline>*{ padding-top: 15px;box-sizing: border-box }
  .fenye{ text-align: center }

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
