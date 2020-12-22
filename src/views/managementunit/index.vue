<template>
  <div class="wrapper">
    <div class="cx">

    </div>
    <div class="biaoge">
      <el-table
        :data="list"
        border
        :header-cell-style="{background:'rgb(203,227,251)',color:'rgb(76,164,255)'}" >
        <el-table-column label="序号" align="center" width="50">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="unitname" label="单位名称" align="center"  show-overflow-tooltip></el-table-column>
        <el-table-column prop="addtime" label="创建时间"  align="center" max-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.addtime | sjian}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updatetime" label="更新时间"  align="center" max-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="disable" label="是否禁用" align="center" width="100">
          <template slot-scope="scope">
            <el-tag  type="danger" v-if=" scope.row.disable === 1">禁用</el-tag>
            <el-tag  type="success" v-else-if="scope.row.disable === 0">正常</el-tag>
            <el-tag type="info" v-else>暂无状态</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </div>
</template>



<script type="text/ecmascript-6">
  import { saleuser } from '@/Api/admin.js'
  export default {
    name: 'index',
    data() {
      return {
        list: [],
        userid:localStorage.getItem("userid"),// 当前登陆用户的角色
      }
    },
    filters: {
      sjian(val){
        return val.replace('T',' ')
      }
    },
    methods: {
      // 请求数据
      _getData(){
        let that = this;
        saleuser({
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
  .cx{ height: 60px }
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
