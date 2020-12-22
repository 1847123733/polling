<template>
  <div class="wrapper">
    <div class="cx">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item class="form-item-select" label="巡检点位：">
          <el-select v-model="searchForm.locationid" placeholder="请选择巡检点位" @change="select1" clearable>
            <el-option v-for="item in uitl" :key="item.locationid" :label="item.locationname" :value="item.locationid" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-select" label="巡检日期：">
          <el-date-picker
            witdh="300px"
            v-model="searchForm.value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="form-item-select" label="巡检月份：">
          <el-select v-model="searchForm.month" placeholder="请选择巡检月份" @change="select" clearable>
            <el-option v-for="item in month" :key="item.index" :label="item.label" :value="item.index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="goon" icon="el-icon-search" @click="querySubmit" size="medium">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button   icon="el-icon-refresh-right" @click="beginAdd" size="medium">重置查询条件</el-button>
        </el-form-item>
        <el-form-item>
          <el-button   icon="el-icon-download"  size="medium" type="export"  @click="exportToExcel">下载报表</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="biaoge">
      <el-table
        id="table"
        :data="list"
        border
        :header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}">
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="address" label="巡检地点" align="center" max-width="100"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="locationname" label="巡检点位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="leader" label="现场负责人" align="center"></el-table-column>
        <el-table-column prop="month" label="巡检月份" align="center">
          <template slot-scope="scope">
            <span>第{{scope.row.month}}月</span>
          </template>
        </el-table-column>
        <el-table-column prop="addtime" label="巡检日期" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
           <span>{{scope.row.addtime | sjian}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="patroler" label="巡检人" align="center" width="70"></el-table-column>
        <el-table-column prop="scene" label="现场环境" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.scene == 0 " class="el-icon-success" style="font-size: 18px;color: green" ></i>
            <i v-else class="el-icon-error" style="font-size: 18px;color: red" ></i>
          </template>
        </el-table-column>
        <el-table-column prop="network" label="现场网络" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.network == 0 " class="el-icon-success" style="font-size: 18px;color: green" ></i>
            <i v-else class="el-icon-error" style="font-size: 18px;color: red" ></i>
          </template>
        </el-table-column>
        <el-table-column prop="bussiness" label="后台业务抽查" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.bussiness == 0" class="el-icon-success" style="font-size: 18px;color: green" ></i>
            <i v-else class="el-icon-error" style="font-size: 18px;color: red" ></i>
          </template>
        </el-table-column>
        <el-table-column prop="hardware" label="硬件设备" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.hardware == 0" class="el-icon-success" style="font-size: 18px;color: green" ></i>
            <i v-else class="el-icon-error" style="font-size: 18px;color: red" ></i>
          </template>
        </el-table-column>
        <el-table-column prop="software" label="软件程序" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.software == 0" class="el-icon-success" style="font-size: 18px;color: green" ></i>
            <i v-else class="el-icon-error" style="font-size: 18px;color: red" ></i>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="130">
          <template slot-scope="scope">
            <el-button  size="mini" icon="el-icon-tickets" type="info" @click="beginLock(scope.row)">查看报表</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        class="table"
        id="table1"
        :data="list"
        border
        :header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}">
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="address" label="巡检地点" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="locationname" label="巡检点位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="leader" label="现场负责人" align="center"></el-table-column>
        <el-table-column prop="month" label="巡检月份" align="center">
          <template slot-scope="scope">
            <span>第{{scope.row.month}}月</span>
          </template>
        </el-table-column>
        <el-table-column prop="addtime" label="巡检日期" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.addtime | sjian}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="patroler" label="巡检人" align="center"></el-table-column>
        <el-table-column prop="scene" label="现场环境" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.scene == 0">正常</span>
            <span v-else>异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="network" label="现场网络" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.network == 0">正常</span>
            <span v-else>异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="bussiness" label="后台业务抽查" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bussiness == 0">正常</span>
            <span v-else>异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="hardware" label="硬件设备" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.hardware == 0">正常</span>
            <span v-else>异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="software" label="软件程序" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.software == 0">正常</span>
            <span v-else>异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" align="center"></el-table-column>
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
        title="详情信息"
        width="100%"
        top="0"
        >
        <div class="tc-biaoge">
          <table border="1" width="100%" cellpadding="0" cellspacing="0" style="font-size: 19px">
            <thead>
              <tr>
                <th colspan="9">自助体检机设备巡检记录表</th>
              </tr>
              <tr>
                <td colspan="3" width="29%">
                  <b>
                    驾校：{{editDialog.model.address}}
                  </b>
                </td>
                <td colspan="4" width="29%">
                  <b>
                    点位：{{editDialog.model.locationname}}
                  </b>
                </td>
                <td colspan="2" width="42%">
                  <b>
                    现场负责人：{{editDialog.model.leader}}
                  </b>
                </td>
              </tr>
              <tr>
                <th>巡检日期</th>
                <th>巡检人</th>
                <th>现场负责人</th>
                <th>现场环境</th>
                <th>现场网络</th>
                <th>后台业务抽查</th>
                <th>硬件设备</th>
                <th>软件查询</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody >
              <tr>
                <th >{{editDialog.model.addtime | sjian}}</th>
                <th >{{editDialog.model.patroler}}</th>
                <th >{{editDialog.model.leader}}</th>
                <th :class="editDialog.model.scene == 0 ? 'lu' : 'red'">
                  <span v-if="editDialog.model.scene == 0" >正常</span>
                  <span v-else >异常</span>
                </th>
                <th :class="editDialog.model.network == 0 ? 'lu' : 'red'">
                  <span v-if="editDialog.model.network == 0">正常</span>
                  <span v-else>异常</span>
                </th>
                <th :class="editDialog.model.bussiness == 0 ? 'lu' : 'red'">
                  <span v-if="editDialog.model.bussiness == 0">正常</span>
                  <span v-else>异常</span>
                </th>
                <th :class="editDialog.model.hardware == 0 ? 'lu' : 'red'">
                  <span v-if="editDialog.model.hardware == 0" >正常</span>
                  <span v-else>异常</span>
                </th>
                <th :class="editDialog.model.software == 0  ? 'lu' : 'red'">
                  <span v-if="editDialog.model.software  == 0">正常</span>
                  <span v-else>异常</span>
                </th>
                <th width="250px">
                  <p>{{editDialog.model.note}}</p>
                </th>

              </tr>
              <tr v-for="item in 12">
                <td v-for="item in 9 "></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="9">
                  注：自助体检设备每月由厂家专业工程师巡检一次，针对现场问题逐一记录处理，没问题填写 “ 正常 ” 有问题列明问题，后台业务抽查有发现违规操作根据自助体检现场规范规定上报处理。
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <!--编辑对话框底部按钮-->
        <div slot="footer" class="ann-w">
          <el-button type="info" plain  class="ann" @click="editDialog.isShow = false">返回</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>



<script type="text/ecmascript-6">
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  import { record } from '@/Api/schedule.js'
  import { getallLocations } from '@/Api/locations.js'

  // 如果要映射的是子仓库
  import  { createNamespacedHelpers } from  'vuex';
  let { mapState } = createNamespacedHelpers('publics');



export default {
    name:'index',
    data(){
        return{
          searchForm:{ locationid:'', value1:'', month:'' },
          querySubmitForm: { locationid:'', value1:'', month:'' },
          list:[],
          // 总条数     页数      每页的条数
          pagination: { total: 0, pageNo: 1, length: 8 },
          editDialog:{
            isShow: false,
            model:{
              address:'',
              addtime:'',
              bussiness:null,
              hardware:null,
              leader:'',
              locationname:'',
              month:null,
              network:null,
              note:'',
              patroler:'',
              scene:null,
              software:null,
            }
          },
          userid:localStorage.getItem("userid"),// 当前登陆用户的id
          name:localStorage.getItem("name"),// 当前登陆用户的id
          uitl:[]
        }
    },
    computed:{
      ...mapState(['month']),          // 将 publics 仓库中的 month 映射到当时组件的计算属性中
    },
    methods:{
      // 请求数据
      _getData(){
        let that = this;
        record({
          userid: that.userid,
          starttime: that.querySubmitForm.value1[0] || '',
          endtime: that.querySubmitForm.value1[1] || '',
          month: that.querySubmitForm.month,
          locationid: that.querySubmitForm.locationid,
          pageNo: that.pagination.pageNo,
          length: that.pagination.length,
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
      // 请求数据所有单位
      _getutilData(){
        let that = this;
        getallLocations({
          locationshort:'',
          city:'',
          openid:'',
          userid:that.userid,
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              that.uitl = response.data.data;
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      },
      // 查询
      querySubmit(){
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this._getData()
      },
      // 条件查询 - 月份
      select(val){
        // console.log(val,'选中的')
        if(val == null || val == '') return
        else {
          let obj = {};
          obj = this.month.find(item => {
            return item.index === val;
          });
          this.searchForm.month = obj.index;
          // console.log(typeof(this.searchForm.disable))
        }
      },
      // 条件查询 - 巡检地点
      select1(val){
        // console.log(val,'选中的')
        if(val == null || val == '') return
        else {
          let obj = {};
          obj = this.month.find(item => {
            return item.locationid === val;
          });
          this.searchForm.locationid = obj.locationid;
          // console.log(typeof(this.searchForm.disable))
        }
      },
      // 条件重置
      beginAdd(){
        this.searchForm.locationid = '';
        this.searchForm.value1 = '';
        this.searchForm.month = '';

        this.querySubmitForm = Object.assign({}, this.searchForm);
        this._getData()
      },
      // 查看报表
      beginLock(row){
        let that = this
        that.editDialog.isShow = true;

        that.editDialog.model.address = row.address;
        that.editDialog.model.addtime = row.addtime;
        that.editDialog.model.bussiness = row.bussiness;
        that.editDialog.model.hardware = row.hardware;
        that.editDialog.model.leader = row.leader;
        that.editDialog.model.locationname = row.locationname;
        that.editDialog.model.month = row.month;
        that.editDialog.model.network = row.network;
        that.editDialog.model.note = row.note;
        that.editDialog.model.patroler = row.patroler;
        that.editDialog.model.scene = row.scene;
        that.editDialog.model.software = row.software;
      },
      // 下载表格 导出Excel
      exportToExcel () {
        if (this.list.length == 0){
          // console.log(1212)
          this.$message({
            type: "warning",
            message: "当前无信息，无法打印"
          });
        }
        else {
          let xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
          let et = XLSX.utils.table_to_book(
            document.querySelector('#table1'),
            xlsxParam
          ); //此处传入table的DOM节点
          // console.log(11,et);
          let etout = XLSX.write(et, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'array'
          });
          try {
            FileSaver.saveAs(
              new Blob([etout], { type: 'application/octet-stream'}),
              '巡检记录表.xlsx'
            );   //trade-publish.xlsx 为导出的文件名
          } catch (e) {
            console.log(e, etout) ;
          }
          return etout;
        }
      },
      // 换每页条数
      sizeChangeHandler(length) {
        this.pagination.length = length;
        this._getData()
      },
      // 换页
      currentChangeHandler(pageNo) {
        this.pagination.pageNo = pageNo;
        this._getData()
      },
    },
    filters: {
      sjian(val){
        return val.replace('T',' ')
      }
    },
    watch:{},
    created() {
      this._getData()
      this._getutilData()
    },
    mounted() { },
}
</script>

<style scoped>
  .wrapper{ width: 100%;height: 100%;background-color: #f0f0f0; }
  .demo-form-inline{ margin-left: 15px }
  .demo-form-inline>*{ padding-top: 15px;box-sizing: border-box }
  .fenye{ text-align: center; }
  tr{ height: 35px }
  .lu{ color: green }
  .red{ color: red }
  .wrapper >>> .el-dialog{ height: 100%;margin: 0 }
  .wrapper >>> .ann-w{ text-align: center }
  .wrapper >>> .ann{ width: 150px;font-size: 18px }
  .table{ display: none }

  .wrapper >>> .el-table{ height: 660px }
  @media screen and (max-height: 860px) {
    .cx{ height: 135px;flex-shrink: 0; }
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
