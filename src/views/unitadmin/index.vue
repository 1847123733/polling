<template>
  <!--  <div>用户信息</div>-->
  <div class="wrapper">
    <div class="cx">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item class="form-item-select" label="单位类型：">
          <el-select clearable v-model="searchForm.unittype" placeholder="请选择单位类型" @change="selectUnitName5">
            <el-option  v-for="(item, i) in util" :key="i" :label="item.label" :value="item.index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="form-item-select" label="单位名称：">
          <el-input v-model="searchForm.unitname"  placeholder="请输入单位名称"  clearable></el-input>
        </el-form-item>

<!--        <el-form-item class="form-item-select" label="单位名称：">-->
<!--          <el-select v-model="searchForm.unitname" filterable placeholder="请选择单位名称">-->
<!--            <el-option v-for="(item,i) in utilname" :key="i" :label="item.label" :value="item.label"></el-option>-->
<!--          </el-select>-->

<!--        </el-form-item>-->
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
        <el-table-column prop="unittype" label="单位类型" align="center" width="90">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.unittype == 1">主管单位</el-tag>
            <el-tag v-else-if="scope.row.unittype == 2" type="success">服务单位</el-tag>
            <el-tag v-else-if="scope.row.unittype == 3" type="info">管理单位</el-tag>
            <el-tag v-else-if="scope.row.unittype == 5" type="warning">驾校单位</el-tag>
            <el-tag type="danger" v-else>未配置</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="areaname" label="单位所在区域" align="center"  show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.areaname == '' || scope.row.areaname == null">
                暂无信息
            </div>
            <div v-else>
              <el-popover placement="bottom" trigger="hover" >
                <div class="look" v-if="scope.row.areacode == '' || scope.row.areacode == null">
                  所在的区号：暂无
                </div>
                <div class="look" v-else>
                  所在的区号： {{ scope.row.areacode }}
                </div>
                <el-tag slot="reference" effect="dark"  type='info' >{{scope.row.areaname}}</el-tag>
              </el-popover>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="unitname" label="单位名称" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="aliasname" label="单位别名" align="center" max-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="leader" label="单位负责人" align="center" max-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tel" label="负责人电话" align="center" max-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="单位地址" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="addtime" label="创建时间"  align="center" max-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="note" label="备注" align="center" show-overflow-tooltip></el-table-column>
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
        :title="`单位 - ${ editDialog.mode ? '新增' : '修改' }`"
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
              <el-form-item label="单位类型：" prop="unittype" style="margin-bottom: 30px">
                <el-select clearable v-model="editDialog.model.unittype" placeholder="请选择单位类型" @change="selectUnitName6" :disabled="!editDialog.mode">
                  <el-option  v-for="(item, i) in util" :key="i" :label="item.label" :value="item.index" ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="单位名称：" prop="unitname" style="margin-bottom: 30px">
                <el-input v-model="editDialog.model.unitname" placeholder="请输入单位名称"></el-input>
              </el-form-item>
              <el-form-item label="单位负责人：" prop="leader" style="margin-bottom: 30px">
                <el-input v-model="editDialog.model.leader" placeholder="请输入单位负责人" ></el-input>
              </el-form-item>
            </div>
            <div style="float: left;width: 50%;">
              <el-form-item label="负责人电话：" prop="tel" style="margin-bottom: 30px">
                <el-input v-model="editDialog.model.tel" placeholder="请输入负责人电话"></el-input>
              </el-form-item>
              <el-form-item label="单位地址：" prop="address" style="margin-bottom: 30px">
                <el-input v-model="editDialog.model.address" placeholder="请输入单位地址"></el-input>
              </el-form-item>
              <el-form-item label="备注：" prop="note" style="margin-bottom: 30px">
                <el-input v-model="editDialog.model.note" placeholder="请输入备注"></el-input>
              </el-form-item>
            </div>
            <div class="clearfix"></div>
          </el-form>
        </div>

        <!--编辑对话框底部按钮-->
        <div slot="footer">
          <el-button icon="el-icon-refresh-right"   @click="czsj" v-if="editDialog.mode">重置输入</el-button>
          <el-button icon="el-icon-check" type="primary" @click="save">保存</el-button>
          <el-button icon="el-icon-close" @click="editDialog.isShow = false"  type="info">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import { sysUnit,sysUnitadd,sysUnitupdate,sysUnitdelete } from '@/Api/unit.js'

  // 如果要映射的是子仓库
  import  { createNamespacedHelpers } from  'vuex';
  let { mapState } = createNamespacedHelpers('publics');


  export default {
    name: 'index',
    data() {
      return {
        // 密码保存
        searchForm: {unittype: '',unitname:''},
        // 查询
        querySubmitForm: { unittype: "",unitname:''},
        list: [],
        // 总条数     页数      每页的条数
        pagination: { total: 0, pageNo: 1, length: 8 },
        editDialog: {
          isShow: false,
          mode: true,
          adduserid: null,
          unitid:null,
          model: {
            unittype: "",
            unitname: "",
            leader: "",
            tel: "",
            address: "",
            note: "",
          },
          rules: {
            unittype: [
              { required: true, message: "单位类型不能为空", trigger: "blur" }
            ],
            unitname: [
              { required: true, message: "单位类型不能为空", trigger: "blur" }
            ],
            leader: [
              { required: true, message: "单位负责人不能为空", trigger: "blur" }
            ],
            tel: [
              {
                validator: (rule, value, callback) => {
                  if (value === "") callback(new Error("负责人电话不能为空"));
                  else if (!/^1[3456789]\d{9}$/.test(value))
                    callback(new Error("请输入正确的手机号码"));
                  else callback();
                },
                trigger: "blur",
                required: true,
              }
            ],
            address: [
              { required: true, message: "单位地址不能为空", trigger: "blur" }
            ]
          }
        },
        // 单位名称
        utilname:[],
        userid:localStorage.getItem("userid"),// 当前登陆用户的角色
      }
    },
    computed:{
      ...mapState(['util']),          // 将 publics 仓库中的 util 映射到当时组件的计算属性中
    },
    methods: {
      // 请求数据
      _getData(){
        let that = this;
        that.utilname = []
        sysUnit({
          length: that.pagination.length,
          pageNo: that.pagination.pageNo,
          unittype:that.querySubmitForm.unittype,
          unitname:that.querySubmitForm.unitname,
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
        this.editDialog.model.unitname = '';
        this.editDialog.model.unittype = '';
        this.editDialog.model.leader = '';
        this.editDialog.model.tel = '';
        this.editDialog.model.address = '';
        this.editDialog.model.note = '';
        this.editDialog.unitid = '';
        this.$refs.form.resetFields();
      },
      // 切换单位类型  条件
      selectUnitName5(val){
        if(val == null || val == '' ) return
        let obj = {};
        obj = this.util.find(item => {
         return item.index === val;
        });
       this.querySubmitForm.unittype = obj.index;
      },
      // 切换单位类型  弹窗
      selectUnitName6(val){

      },
      // 新增按钮
      beginAdds(){
        this.editDialog.mode = true;
        this.editDialog.isShow = true;
      },
      // 编辑
      beginUpdate(row){
        // console.log(row,3333)
        this.editDialog.mode = false;
        this.editDialog.isShow = true;

        this.editDialog.adduserid = row.adduserid;
        this.editDialog.model.unittype = row.unittype;
        this.editDialog.model.unitname = row.unitname;
        this.editDialog.model.leader = row.leader;
        this.editDialog.model.tel = row.tel;
        this.editDialog.model.address = row.address;
        this.editDialog.model.note = row.note;
        this.editDialog.unitid = row.unitid;
      },
      // 保存  编辑 - 修改
      save(){
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this
              sysUnitadd({
                ...that.editDialog.model,
              })
                .then(function(response) {
                  if (response.data.code === 20000) {
                    console.log(response.data,333)
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
              sysUnitupdate({
                id: that.editDialog.adduserid,
                unittype:that.editDialog.model.unittype,
                unitname:that.editDialog.model.unitname,
                leader:that.editDialog.model.leader,
                tel:that.editDialog.model.tel,
                address:that.editDialog.model.address,
                note:that.editDialog.model.note,
                unitid: that.editDialog.unitid,
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
        // console.log(row,6666)
        this.$confirm(`确定要删除单位名称为 ‘ ${row.unitname} ’ 吗？`, "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            sysUnitdelete({
              unitid:row.unitid,
              unitname:row.unitname
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
          this.editDialog.id = 0;
          this.editDialog.model.unittype = '';
          this.editDialog.model.unitname = '';
          this.editDialog.model.leader = '';
          this.editDialog.model.tel = '';
          this.editDialog.model.address = '';
          this.editDialog.model.note = '';
          this.editDialog.unitid = '';
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
