<template>
  <!--  <div>用户信息</div>-->
  <div class="wrapper">
    <div class="cx">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item class="form-item-select" label="设备编号：">
         <!-- <el-select clearable v-model="searchForm.deviceno" placeholder="请选择设备编号" >
            <el-option  v-for="(item, i) in util" :key="i" :label="item" :value="item"></el-option>
          </el-select>-->
          <el-input v-model="searchForm.deviceno"  placeholder="请输入设备编号"  clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="goon" icon="el-icon-search" @click="querySubmit" size="medium">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button   icon="el-icon-refresh-right" @click="beginAdd" size="medium">重置查询条件</el-button>
        </el-form-item>
        <el-form-item style="float: right;margin-right: 250px">
          <el-button type="primary"  icon="el-icon-plus" @click="beginAdds" size="medium">新增</el-button>
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
        <el-table-column prop="locationname" label="设备存放地点" align="center" max-width="150" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="deviceno" label="设备编号" align="center" max-width="140" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="address" label="详细地址" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="mainter" label="负责人" align="center" max-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tel" label="电话" align="center"  max-width="110" show-overflow-tooltip></el-table-column>
        <el-table-column prop="disable" label="是否锁定" align="center" max-width="100">
          <template slot-scope="scope">
            <el-tag  type="danger" v-if=" scope.row.disable === 1">锁定</el-tag>
            <el-tag  type="success" v-else-if="scope.row.disable === 0">未锁定</el-tag>
            <el-tag type="info" v-else>暂无状态</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="设备状态" align="center" max-width="100">
          <template slot-scope="scope">
            <div v-if=" scope.row.state === 1">
              <el-popover placement="top" trigger="hover" >
                <div class="look" v-if="scope.row.statemsg == '' || scope.row.statemsg == null">
                  异常原因：无
                </div>
                <div class="look" v-else>
                  异常原因：
                  <p>
                    {{ scope.row.statemsg }}
                  </p>
                </div>
                <el-tag slot="reference"  type="danger">异常</el-tag>
              </el-popover>


            </div>
          <div v-if="scope.row.state === 0">
            <el-tag  type="success" >正常</el-tag>
          </div>


          </template>
        </el-table-column>
        <el-table-column prop="addtime" label="创建时间"  align="center" max-width="150" show-overflow-tooltip></el-table-column>

        <el-table-column prop="note" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="230">
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
        :title="`设备地址 - 设备编号为： ${editDialog.model.deviceno} `"
        width="700px">
        <el-amap
          vid="amapDemo"
          :center="center"
          :zoom="zoom"
          class="amap-demo"
          :events="events">
          <el-amap-marker v-for="(marker,i) in markers" :key="i"></el-amap-marker>
        </el-amap>
      </el-dialog>
      <el-dialog
        class="dialog-edit" :visible.sync="editDialog.isShows"
        :title="`设备信息 - ${ editDialog.mode ? '新增' : '修改' }`" width="650px">
        <!--用mode判断新增或修改，true表示新增，false表示修改-->
        <!--编辑对话框表单-->
        <el-form
          :model="editDialog.models" :rules="editDialog.rules"
          label-width="120px" ref="form">
          <div style="float: left;width: calc(50% - 10px);margin-right: 10px">
            <el-form-item label="设备编号：" prop="deviceno"  style="margin-bottom: 50px">
              <el-input v-model="editDialog.models.deviceno" placeholder="请输入设备编号" :disabled="!editDialog.mode"></el-input>
            </el-form-item>
            <el-form-item label="负责人：" prop="mainter"  style="margin-bottom: 50px">
              <el-input v-model="editDialog.models.mainter" placeholder="请输入负责人" ></el-input>
            </el-form-item>
            <el-form-item label="负责人电话：" prop="tel"  style="margin-bottom: 50px">
              <el-input v-model="editDialog.models.tel" placeholder="请输入负责人电话" ></el-input>
            </el-form-item>
            <el-form-item label="是否锁定：" prop="disable"  style="margin-bottom: 50px"  v-if="!editDialog.mode">
              <el-switch
                v-model="editDialog.models.disable"
                active-color="#13ce66" inactive-color="#ff4949"
                active-text="未锁定" inactive-text="锁定">
              </el-switch>
            </el-form-item>
          </div>
          <div style="float: left;width: 50%;">
            <el-form-item label="设备类型：" prop="devicetype"  style="margin-bottom: 50px" v-if="editDialog.mode">
              <el-select v-model="editDialog.models.devicetype" placeholder="请选择设备类型" @change="selectdevicetype" clearable>
                <el-option v-for="(item,i) in devicetype" :key="i" :label="item.label" :value="item.index" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="点位名称：" prop="locationname"  style="margin-bottom: 50px" v-if="!editDialog.mode">
              <el-input v-model="editDialog.models.locationname" placeholder="请输入点位名称" disabled></el-input>
            </el-form-item>

            <el-form-item label="详细地址：" prop="address"  style="margin-bottom: 50px">
              <el-input v-model="editDialog.models.address" placeholder="请输入详细地址" ></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="note"  style="margin-bottom: 50px">
              <el-input v-model="editDialog.models.note" placeholder="备注" ></el-input>
            </el-form-item>


          </div>
          <div class="clearfix"></div>
        </el-form>
        <!--编辑对话框底部按钮-->
        <div slot="footer">
<!--          @click="czsj"        @click="save"-->
          <el-button icon="el-icon-refresh-right"  @click="czsj"  v-if="editDialog.mode">重置输入</el-button>
          <el-button icon="el-icon-check" type="primary" @click="save">保存</el-button>
          <el-button icon="el-icon-close" @click="editDialog.isShows = false"  type="info">取消</el-button>

        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script type="text/ecmascript-6">
  import { device,deviceadd,deviceupdate,devicedelete } from '@/Api/device.js'
  import { validater } from "@/utils/validater";

  // 如果要映射的是子仓库
  import  { createNamespacedHelpers } from  'vuex';
  let { mapState } = createNamespacedHelpers('publics');

  export default {
    name: 'index',
    data() {
      let that = this;
      return {
        // 密码保存
        searchForm: { deviceno: '' },
        // 查询
        querySubmitForm: { deviceno: "" },
        list: [],
        // 总条数     页数      每页的条数
        pagination: { total: 0, pageNo: 1, length: 8 },
        editDialog: {
          isShow: false,
          isShows: false,
          model: {
            deviceno: "",
          },
          //  新增修改
          models: {
            deviceno:'',
            address:'',
            mainter:'',
            tel:'',
            note:'',
            deviceid:null,
            locationid:null,
            locationname:'',
            disable:null,
            devicetype:null,
          },
          rules: {
            deviceno: [
              { required: true, message: "设备编号不能为空", trigger: "blur" },
              { validator: validater.enOrnunText, trigger: "blur" }
            ],
            address: [
              { required: true, message: "详细地址不能为空", trigger: "blur" }
            ],
            mainter: [
              { required: true, message: "负责人不能为空", trigger: "blur" }
            ],
            devicetype: [
              { required: true, message: "设备类型不能为空", trigger: "blur" }
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
            ]
          }
        },
        // 高德 地图
        zoom: 10,
        center: [],
        address: '',
        events: {
          click(e) {
            let { lng, lat } = e.lnglat;
            that.lng = lng;
            that.lat = lat;
            that.isshow =  false
          }
        },
        // 存放点击的坐标
        markers: [],
        // 高德
        util:[],
        userid:localStorage.getItem("userid"),// 当前登陆用户的角色
      }
    },
    computed:{
      ...mapState(['devicetype']),  // 将 publics 仓库中的 devicetype 映射到当时组件的计算属性中
    },
    methods: {
      // 请求数据
      _getData(){
        let that = this;
        that.util = []
        device({
          length: that.pagination.length,
          pageNo: that.pagination.pageNo,
          deviceno:that.querySubmitForm.deviceno,
          userid:that.userid,
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              if (response.data.data.length == 0){
                that.$message({
                  message: '暂无信息',
                  type: 'warning'
                });
              }else {
                that.list = response.data.data;
                that.pagination.total = response.data.recordsTotal;
                for (let i = 0; i < that.list.length; i++) {
                  let utils = that.list[i].deviceno;
                  that.util.push(utils);
                }
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
        that.searchForm.deviceno = ''
        that.querySubmitForm = Object.assign({}, this.searchForm);
        that._getData()
      },
      // 弹窗 新增设备信息的设备类型选择
      selectdevicetype(val){

      },
      // 弹窗 重置按钮
      czsj(){
        this.$refs.form.resetFields();
        this.editDialog.models.deviceno = '';
        this.editDialog.models.address = '';
        this.editDialog.models.mainter = '';
        this.editDialog.models.tel = '';
        this.editDialog.models.note = '';
        this.editDialog.models.deviceid = null;
        this.editDialog.models.locationid = null;
        this.editDialog.models.locationname = null;
      },

      // 表格修改按钮
      beginUpdate(row){
        // console.log(row,222)
        this.editDialog.mode = false;
        this.editDialog.isShows = true;

        this.editDialog.models.deviceno = row.deviceno;
        this.editDialog.models.address = row.address;
        this.editDialog.models.mainter = row.mainter;
        this.editDialog.models.tel = row.tel;
        this.editDialog.models.note = row.note;
        this.editDialog.models.deviceid = row.deviceid;
        this.editDialog.models.locationname = row.locationname;
        this.editDialog.models.locationid = row.locationid;

        if (row.disable == 1) this.editDialog.models.disable = false;
        else if (row.disable == 0) this.editDialog.models.disable = true;
        else  this.editDialog.models.disable = null;



        // this.editDialog.models.disable = row.disable;


      },
      // 表格删除按钮
      beginRemove(row){
        // console.log(row,3333)
        this.$confirm(`确定要删除设备编号为 ‘ ${row.deviceno} ’ 吗？`, "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            devicedelete({
              deviceid:row.deviceid,
              userid:that.userid
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
      // 查询条件新增按钮
      beginAdds(){
        this.editDialog.mode = true;
        this.editDialog.isShows = true;
      },
      // 新增 修改 弹窗 保存
      save(){
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this;
              deviceadd({
                deviceno:that.editDialog.models.deviceno,
                address:that.editDialog.models.address,
                mainter:that.editDialog.models.mainter,
                tel:that.editDialog.models.tel,
                note:that.editDialog.models.note,
                devicetype:that.editDialog.models.devicetype,

              })
                .then(function(response) {
                  if (response.data.code === 20000) {
                    // console.log(response)
                    that.editDialog.isShows = false;
                    // console.log(response)
                    that.$message({
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
              console.log(that.editDialog.models.disable,1)
              console.log(that.editDialog.models.disable == false ? 1 : 0,22222)
              deviceupdate({
                deviceno:that.editDialog.models.deviceno,
                address:that.editDialog.models.address,
                mainter:that.editDialog.models.mainter,
                tel:that.editDialog.models.tel,
                note:that.editDialog.models.note,
                locationid:that.editDialog.models.locationid,
                locationname:that.editDialog.models.locationname,
                deviceid:that.editDialog.models.deviceid,
                disable:that.editDialog.models.disable == false ? 1 : 0,
              })
                .then(function(response) {
                  if (response.data.code === 20000) {
                    that.editDialog.isShows = false;
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


      // 查看 设备地址
      weiz(row){
        let that = this;
        if (row.location == '' || row.location == null) {
          this.$message({
            message: `当前设备编号为 ${row.deviceno} 的没有经纬度，正在更新`,
            type: 'warning'
          });
        }else {
          // console.log(row.location,9999999999999999)
          that.editDialog.isShow = true
          that.editDialog.model.deviceno = row.deviceno;
          let str = row.location
          let arr = str.split(",")
          that.center = arr;
          that.markers.splice(0,1,row.location);
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
      "editDialog.isShows"(newValue) {
        if (!newValue) {
          this.$refs.form.resetFields();
          this.editDialog.models.deviceno = '';
          this.editDialog.models.address = '';
          this.editDialog.models.mainter = '';
          this.editDialog.models.tel = '';
          this.editDialog.models.note = '';
          this.editDialog.models.deviceid = null;
          this.editDialog.models.locationid = null;
          this.editDialog.models.locationname = '';
          this.editDialog.models.devicetype = null;
        }
      }

    },
    //存放 过滤器
    filters: {
      sjian(val){
        return val[0] +'-'+ val[1].toString().padStart(2,'0')+'-'+val[2].toString().padStart(2,'0')+' '+val[3].toString().padStart(2,'0')+':'+val[4].toString().padStart(2,'0')+':'+val[5].toString().padStart(2,'0')
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
  .amap-demo { height: 500px; }


  .wrapper >>> .el-table{ height: 660px }
  @media screen and (max-height: 860px) {
    .cx{ height: 60px;flex-shrink: 0; }
    .fenye{ height: 100px;flex-shrink: 0; }
    .wrapper >>> .el-table{ height: 500px;overflow: auto }
  }
  @media screen and (max-height: 760px) {
    .wrapper >>> .el-table{ height: 400px;overflow: auto }
  }
  @media screen and (max-height: 850px) {
    .wrapper >>> .el-dialog{ margin-top: 5vh!important; }
  }
  @media screen and (max-height: 805px) {
    .wrapper >>> .el-dialog{ margin-top: 2vh!important; }
  }
  @media screen and (max-height: 725px) {
    .wrapper >>> .el-table{ height: 300px;overflow: auto }
  }
</style>
