<template>
  <div class="wrapper">
    <div class="tiaojian">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item class="form-item-select" label="单位名称：">
          <el-select v-model="searchForm.Unitid" placeholder="请选择单位名称" @change="selectUnitName" clearable filterable >
            <el-option v-for="item in unit" :key="item.index" :label="item.unitname" :value="item.unitid" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="goon" icon="el-icon-search" @click="querySubmit" size="medium">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh-right" @click="beginAdd" size="medium">重置查询条件</el-button>
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
        <el-table-column prop="locationname" label="点位名称" align="center" max-width="190"  show-overflow-tooltip> </el-table-column>
        <el-table-column prop="locationshort" label="点位简称" align="center" max-width="70" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unitname" label="点位所在单位名称" align="center" max-width="150"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="province" label="所在省" align="center" max-width="100" ></el-table-column>
        <el-table-column prop="city" label="所在市" align="center" max-width="100"></el-table-column>
        <el-table-column prop="area" label="所在地区" align="center" max-width="100"></el-table-column>
        <el-table-column prop="location" label="定位" align="center" max-width="150"></el-table-column>
        <el-table-column prop="addtime" label="添加时间" align="center" max-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="locks" label="是否被锁定"  align="center" max-width="100"
                         :filters="[{ text: '未锁定', value: 0 }, { text: '锁定', value: 1 }]"
                         :filter-method="filterTag"
                         filter-placement="bottom-end">
          <template slot-scope="scope">


            <el-tag  type="success" v-if="scope.row.locks == 0">未锁定</el-tag>
            <el-tag  type="warning" v-else>锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-s-finance" type="warning" @click="binding(scope.row)">绑定设备</el-button>
            <el-button size="mini" icon="el-icon-edit" type="amend" @click="beginUpdate(scope.row)" :disabled="scope.row.locks == 1">修改</el-button>
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
    <div class="tankuang">
      <el-dialog
        class="dialog-edit" :visible.sync="editDialog.isShow"
        :title="`点位信息 - ${ editDialog.mode ? '新增' : '修改' }`" width="650px">
        <!--用mode判断新增或修改，true表示新增，false表示修改-->
        <!--编辑对话框表单-->
        <el-form
          :model="editDialog.model" :rules="editDialog.rules"
          label-width="120px" ref="form">
          <el-form-item label="行政区划：" prop="areaCode"  style="margin-bottom: 50px" v-model="editDialog.model.areaCode">
              <el-select style="width: 142px" v-model="provinceValue" placeholder="请选择省" @change="selectProvimce" >
                <el-option v-for="(item,index) of provincearr" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-select style="width: 142px" v-model="cityValue" placeholder="请选择市" @change="selectcity">
                <el-option v-for="(item,index) of cityarr" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <el-select style="width: 142px" v-model="RegionValue" placeholder="请选择区/县"  @change="selectRegion">
                <el-option v-for="(item,index) of regionarr" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <div style="float: left;width: calc(50% - 10px);margin-right: 10px">
            <el-form-item label="点位名称：" prop="locationname"  style="margin-bottom: 50px">
              <el-input v-model="editDialog.model.locationname" placeholder="请输入点位名称" ></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="note"  style="margin-bottom: 30px">
              <el-input v-model="editDialog.model.note" placeholder="请输入备注" ></el-input>
            </el-form-item>
          </div>
          <div style="float: left;width: 50%;">
            <el-form-item label="单位名称：" prop="unitname"  style="margin-bottom: 50px">
              <el-select v-model="editDialog.model.unitname" placeholder="请选择单位名称" @change="selectUnitName1" clearable filterable >
                <el-option v-for="item in unit" :key="item.index" :label="item.unitname" :value="item.unitid" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否锁定：" prop="locks"  style="margin-bottom: 50px" v-if='!editDialog.mode'>
              <el-switch
                v-model="editDialog.model.locks"
                active-color="#13ce66" inactive-color="#ff4949"
                active-text="未锁定" inactive-text="锁定">
              </el-switch>
            </el-form-item>
          </div>
          <div class="clearfix"></div>
        </el-form>
        <!--编辑对话框底部按钮-->
        <div slot="footer">
          <el-button icon="el-icon-refresh-right"  @click="czsj" v-if="editDialog.mode">重置输入</el-button>
          <el-button icon="el-icon-check" type="primary" @click="save">保存</el-button>
          <el-button icon="el-icon-close" @click="editDialog.isShow = false"  type="info">取消</el-button>

        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="editDialog.isShows" :title="`点位-(${editDialog.models.locationname})-绑定设备`"
        width="700px" top="10vh">
        <div class="baocd">
          <div>
            <h5>已绑定的设备</h5>
          </div>
          <div class="bianhao1">
            <div v-if="hasbinds.length == 0" class="bianhao" style="color: red">
              <h3>该点位暂无绑定设备，请在下方添加相关设备</h3>
            </div>
            <div v-else class="bianhao">
              <el-tag
                v-cloak closable type="success" :key="tag"
                v-for="tag in hasbinds" :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
            </div>

          </div>
          <div style="margin-top: 10px">绑定新的设备</div>
          <div class="cx1">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item class="form-item-select" >
                <el-input v-model="searchForms.deviceno"  placeholder="请输入设备编号"  clearable></el-input>
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
              target-order="unshift"
              v-model="editDialog.models.deviceno"
              :data="devices"
              :titles="['所有的设备', '添加的设备']"
              @mouseover.native="addTitle"
              @change="dataChoice"></el-transfer>
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
<!--          <el-button icon="el-icon-refresh-right"  @click="czsj" v-if="editDialog.mode">重置输入</el-button>-->
          <el-button icon="el-icon-check" type="primary" @click="saves" v-show="editDialog.models.deviceno.length != 0">保存</el-button>
          <el-button icon="el-icon-close" @click="editDialog.isShows = false"  type="info">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>



<script type="text/ecmascript-6">
  import {
    locations,
    locationshasbind,
    locationsunbind,
    locationsbinding,
    locationsdelete,
    locationsadd,
    locationsupdate
  } from '@/Api/locations.js'
  import { getAllUnitList } from '@/Api/unit.js'
  import { listpage } from '@/Api/device.js'
  import { province } from "@/assets/area";

  // import request from "@/utils/request";
  export default {
    name:'index',   // 点位管理
    data(){
      return{
        //省市区start
        provincearr: [],    // 所有的 省 市 区  号/名称
        cityarr: [],        // 所有的 市
        regionarr: [],      // 所有的 区
        provinceValue: "",  // 省 号
        cityValue: "",      // 市区号
        RegionValue: "",    // 区/县号
        //省市区end

        // 查询条件
        searchForm:{ Unitid:'',unittype:'',unitname:'' },
        querySubmitForm:{ Unitid:'',unittype:'',unitname:'' },
        searchForms:{ deviceno:'' },
        querySubmitForms:{ deviceno:'' },
        // 数据 - 表格
        list:[],
        // 单位
        unit:[],
        // 已经保存的设备  点位 - 设备
        hasbind:[],
        // 所有的设备编号
        device:[],
        // 编辑
        editDialog: {
          isShow: false,
          isShows: false,
          mode: true,
          id: 0,
          model: {
            locationname:'',
            unitname:'',
            note:'',
            unitid:'',
            locks:null,
            locationid:null,
            province:'',
            city:'',
            area:'',
            areaCode:'',
          },
          models:{ locationname:'',locationid:null,deviceno:[] },
          rules: {
            locationname: [
              { required: true, message: "点位名称不能为空", trigger: "blur" }
            ],
            unitname: [
              { required: true, message: "点位名称不能为空", trigger: "blur" }
            ],
            locks: [
              { required: true, message: "不能为空", trigger: "blur" }
            ],
            areaCode: [
              { required: true, message: "点位位置不能为空", trigger: "blur" }
            ],

          }
        },
        // 总条数     页数      每页的条数
        pagination: { total: 0, pageNo: 1, length: 8 },
        paginations: { total: 0, pageNo: 1, length: 7 },
        userid:localStorage.getItem("userid"),// 当前登陆用户的角色
      }
    },
    // 计算属性
    computed:{
      // 点位已经有的
      hasbinds(){
        let arr = [];
        for (let i = 0; i<this.hasbind.length;i++){
          arr.push(this.hasbind[i].deviceno)
        }
        return arr
      },
      // 所有的设备  - 点位已经有的
      devices(){
        let arr = [];
        for (let i = 0; i<this.device.length;i++){
          arr.push({
            key:this.device[i].deviceno,
            label:this.device[i].deviceno
          })
        }
        let arr1 = arr.filter((item,index) => {
          if (this.hasbinds.indexOf(item.label) <= -1){
            return item
          }
        })
        return arr
      }
    },
    // 方法
    methods:{
      //选择省
      selectProvimce(id) {
        console.log(id)
        this.cityarr = [];
        this.regionarr = [];

        this.cityValue = "";
        this.RegionValue = "";


        for (let item of this.provincearr) {
          if (id == item.id) {
            this.cityarr = item.children;
            this.editDialog.model.province = item.name
          }
        }
        this.editDialog.model.areaCode = this.provinceValue;
      },
      //选择市
      selectcity(id) {
        this.regionarr = [];
        this.RegionValue = "";
        for (let item of this.cityarr) {
          if (id == item.id) {
            this.regionarr = item.children;
            this.editDialog.model.city = item.name
          }
        }
        this.editDialog.model.areaCode = this.cityValue;
      },
      //选择区
      selectRegion(id) {
        for (let item of this.regionarr) {
          if (id == item.id) {
            this.editDialog.model.area = item.name
            // console.log(this.editDialog.model.area)
          }
        }
        this.editDialog.model.areaCode = this.RegionValue;
      },

      // 请求数据
      _getData(){
        let that = this;
        locations({
          length: that.pagination.length,
          pageNo: that.pagination.pageNo,
          unitid: that.querySubmitForm.Unitid,
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
      // 请求单位数据
      _getUnitData(){
        let that = this;
        getAllUnitList({
          unittype: that.querySubmitForm.unittype,
          unitname: that.querySubmitForm.username,
          userid: that.userid,
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              let obj = {};
              for (let i = 0 ; i<response.data.data.length;i++){
                obj = {};
                obj.index = response.data.data[i].unitid;
                obj.unitname = response.data.data[i].unitname;
                obj.unitid = response.data.data[i].unitid;
                that.unit.push(obj)
              }
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 请求点位已绑定设备接口
      _getshebData(){
        let that = this;
        locationshasbind({
          locationid:that.editDialog.models.locationid
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.hasbind = response.data.data
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 请求所有设备  - 分页
      _getallDevice(){
        let that = this;
        listpage({
          length:that.paginations.length,
          pageNo:that.paginations.pageNo,
          deviceno:that.querySubmitForms.deviceno,
          userid:that.userid,
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.device = response.data.data
              that.paginations.total = response.data.recordsTotal;
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 弹窗文字溢出          点位绑定设备
      addTitle(e) {
        //手动给鼠标划过的元素添加一个title
        let target_el = e.target;
        if (target_el.title) return;
        target_el.title = target_el.innerText;
      },
      // 弹窗 点位绑定设备
      dataChoice(value,direction,movedkeys){
        console.log(value,direction,movedkeys,6666)
      },
      // 删除点位绑定的设备
      handleClose(label){
        // console.log(typeof (label),3333)
        this.$confirm(`确定要删除与点位（${this.editDialog.models.locationname}）相关的设备编号为 ‘ ${label} ’ 吗？`, "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            locationsunbind({
              locationid: that.editDialog.models.locationid,
              deviceno: label
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  that.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  that.hasbind.splice(that.hasbinds.indexOf(label), 1);
                  that._getshebData();
                }
              })
              .catch(function(error) {
                console.log(error, "报错信息");
              });
          })
          .catch(() => {});
      },
      // 保存点位相关设备
      saves(){
        let that = this;
        let deviceno = that.editDialog.models.deviceno.join(',');
        locationsbinding({
          locationid: that.editDialog.models.locationid,
          locationname: that.editDialog.models.locationname,
          deviceno: deviceno
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.$message({
                type: "success",
                message: response.data.message,
              });
              that.editDialog.models.deviceno = [];
              that._getshebData();
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 表格 列 - 条件查询
      filterTag(value, row) {
        // console.log(value,row)
        return row.locks === value;
      },
      // 条件查询
      querySubmit(){
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this._getData()
      },
      // 条件查询 - 绑定的设备号
      querySubmits(){
        this.querySubmitForms = Object.assign({}, this.searchForms);
        this._getallDevice()
      },
      // 重置查询条件
      beginAdd(){
        let that = this
        that.searchForm.Unitid = ''
        that.searchForm.unittype = ''
        that.searchForm.unitname = ''
        that.querySubmitForm = Object.assign({}, this.searchForm);
        that._getData()
      },
      // 新增按钮
      beginAdds(){
        this.editDialog.mode = true;
        this.editDialog.isShow = true;
      },
      // 绑定设备
      binding(row){
        // console.log(row,333)
        this.editDialog.isShows = true;
        this.editDialog.models.locationname = row.locationname;
        this.editDialog.models.locationid = row.locationid;
        this.hasbind = []

        this._getshebData()

      },
      // 修改按钮
      beginUpdate(row){
        // console.log(row,6666)
        this.editDialog.mode = false;
        this.editDialog.isShow = true;
        this.editDialog.model.locationname = row.locationname;
        this.editDialog.model.unitname = row.unitname;
        this.editDialog.model.note = row.note;
        this.editDialog.model.unitid = row.unitid;
        this.editDialog.id = row.locationid;
        // 省市区 号
        this.provinceValue = row.provinceno;
        this.cityValue = row.cityno;
        this.RegionValue = row.areano;
        // 省市区 名字
        this.editDialog.model.province = row.province;
        this.editDialog.model.city = row.city;
        this.editDialog.model.area = row.area;

        for (let item of this.provincearr) {
          if (this.provinceValue == item.id) {
            this.cityarr = item.children;
          }
        }
        for (let item of this.cityarr) {
          if (this.cityValue == item.id) {
            this.regionarr = item.children;
          }
        }



        if (row.locks == 1){
          this.editDialog.model.locks = false;
        }
        else {
          this.editDialog.model.locks = true;
        }



      },
      // 删除按钮
      beginRemove(row){
        // console.log(row,33)
        this.$confirm(`确定要删除点位名称为 ‘ ${row.locationname} ’ 吗？`, "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            that.editDialog.model.locationid = row.locationid
            locationsdelete({
              locationid: that.editDialog.model.locationid
            })
              .then(function(response) {
                if (response.data.code === 20000) {
                  that.editDialog.isShow = false;
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
      // 弹框 - 清空
      czsj(){
        this.$refs.form.resetFields();
        this.editDialog.id = 0;
        this.editDialog.model.locationname = '';
        this.editDialog.model.unitname = '';
        this.editDialog.model.note = '';
        this.editDialog.model.unitid = '';
        this.editDialog.model.locks = null;
      },
      beginAddss(){
        this.searchForms.deviceno = '';
        this.querySubmitForms = Object.assign({}, this.searchForms);
        this._getallDevice()
      },
      // 保存按钮
      save(){
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this;
              locationsadd({
                locationname: that.editDialog.model.locationname,
                unitname: that.editDialog.model.unitname,
                note: that.editDialog.model.note,
                unitid: that.editDialog.model.unitid,
                provinceno: that.provinceValue,
                province: that.editDialog.model.province,
                cityno: that.cityValue,
                city: that.editDialog.model.city,
                areano: that.RegionValue,
                area: that.editDialog.model.area,
              })
                .then(function(response) {
                  if (response.data.code === 20000) {
                    that.editDialog.isShow = false;
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
              if (this.editDialog.model.locks == true){
                this.editDialog.model.locks = 0
              }
              else {
                this.editDialog.model.locks = 1
              }
              locationsupdate({
                locationid:that.editDialog.id,
                locationname: that.editDialog.model.locationname,
                unitname: that.editDialog.model.unitname,
                note: that.editDialog.model.note,
                unitid: that.editDialog.model.unitid,
                locks: that.editDialog.model.locks,
                provinceno: that.provinceValue,
                province: that.editDialog.model.province,
                cityno: that.cityValue,
                city: that.editDialog.model.city,
                areano: that.RegionValue,
                area: that.editDialog.model.area,
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
      // 条件查询 - 单位名称选择
      selectUnitName(val) {
        // console.log(val,'选中的')
        if (val == null || val == '') return
        else {
          let obj = {};
          obj = this.unit.find(item => {
            return item.unitid === val;
          });
          this.searchForm.unitname = obj.unitname;
        }
      },
      // 弹框按钮 - 单位名称选择
      selectUnitName1(val) {
        // console.log(val,'选中的')
        if (val == null || val == '') return
        else {
          let obj = {};
          obj = this.unit.find(item => {
            return item.unitid === val;
          });
          this.editDialog.model.unitname = obj.unitname;
          this.editDialog.model.unitid = obj.unitid;
        }
      },
      // 每页多少条
      handleSizeChange(length) {
        this.paginations.length = length;
        this._getallDevice()
      },
      // 当前第几页
      handleCurrentChange(pageNo) {
        this.paginations.pageNo = pageNo;
        this._getallDevice()
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
    //存放 过滤器
    filters: {},
    // 监听
    watch:{
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();
          this.editDialog.id = 0;
          this.editDialog.model.locationname = '';
          this.editDialog.model.unitname = '';
          this.editDialog.model.note = '';
          this.editDialog.model.unitid = '';
          this.editDialog.model.locks = null;
          this.provinceValue = '';
          this.cityValue = '';
          this.RegionValue = '';
          this.editDialog.model.province = '';
          this.editDialog.model.city = '';
          this.editDialog.model.area = '';

          this.cityarr = [];
          this.regionarr = [];
        }
      },
      "editDialog.isShows"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.editDialog.models.deviceno = []
          this.searchForms.deviceno = '';
          this.querySubmitForms = Object.assign({}, this.searchForms);
          this.paginations.pageNo = 1

          this._getallDevice()
        }
      }
    },
    created() {
      this._getData()
      this._getUnitData()
      this._getallDevice()
      this.provincearr = province;    // 地区三级联动
    },

}
</script>

<style scoped>
  .wrapper{ width: 100%;height: 100%;background-color: #f0f0f0; }
  .demo-form-inline{ margin-left: 15px }
  .demo-form-inline>*{ padding-top: 15px;box-sizing: border-box }
  .fenye{ text-align: center; }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .wrapper >>> .el-transfer-panel{ width:210px }
  .bianhao{
    height: 80px;display: flex;flex-wrap: wrap;
    overflow: auto;border: 1px dashed #c0c4cc;border-radius: 10px;
    padding: 10px;box-sizing: border-box;margin-top: 5px;
  }
  .bianhao>*{ margin-bottom: 10px; }
  .xin-sheb{ padding: 10px;box-sizing: border-box }


  [v-cloak] {
    display: none
  }
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
