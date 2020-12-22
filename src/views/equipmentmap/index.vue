<template>
  <div class="wrapper">
    <div class="cx">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="设备所在地：">
          <el-row>
            <el-select style="width: 142px" v-model="provinceValue" placeholder="请选择省" @change="selectProvimce">
              <el-option v-for="(item,index) of provincearr" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select style="width: 142px" v-model="cityValue" placeholder="请选择市" @change="selectcity">
              <el-option v-for="(item,index) of cityarr" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select style="width: 142px" placeholder="请选择区/县" v-model="RegionValue" @change="selectRegion">
              <el-option v-for="(item,index) of regionarr" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-row>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select clearable v-model="searchForm.disable" placeholder="请选择是否可用" @change="selectUnitName6" >
            <el-option  v-for="(item, i) in str" :key="i" :label="item.label" :value="item.index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位id：">
          <el-input v-model="searchForm.unitid" placeholder="请输入单位id"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="goon" icon="el-icon-search" @click="querySubmit" size="medium">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button   icon="el-icon-refresh-right" @click="beginAdd" size="medium">重置查询条件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="ditu" ></div>
    <div class="fh">
      <el-button type="info" @click="goback">回到中国地图</el-button>
    </div>
  </div>
</template>



<script type="text/ecmascript-6">
  import { province,map } from "@/assets/area";
  import { Message } from "element-ui";
  import request from "@/utils/request";


  // 如果要映射的是子仓库
  import  { createNamespacedHelpers } from  'vuex';
  let { mapState } = createNamespacedHelpers('publics');

export default {
    name:'index',
    data(){
        return{
          //省市区start
          maparr:[],          // 所有的省市区的    名字  巡检系统单独的
          maparr1:[],         // 所有的省市区的    区划号 巡检系统单独的
          provincearr: [],    // 所有的 省 市 区  号/名称
          cityarr: [],        // 所有的 市
          regionarr: [],      // 所有的 区
          provinceValue: "",  // 省 号
          cityValue: "",      // 市区号
          RegionValue: "",    // 区/县号
          //省市区end
          // 坐标
          datas: [],
          // 点击几次 返回中国地图
          // chishu:0,
          searchForm: { provinceno: '',cityno:"",areano:"",disable:'',unitid:'' },
          querySubmitForm: { provinceno: '',cityno:"",areano:"",disable:'',unitid:'' },
          // 暂时没有用
          times:'',
          // 查询 地图 切换
          cxdtcsh:"china",
        }
    },
    computed:{
      ...mapState(['str']),          // 将 publics 仓库中的 str 映射到当时组件的计算属性中
      ...mapState(['provincesText']),// 将 publics 仓库中的 provincesText 映射到当时组件的计算属性中
    },
    methods:{
      //选择省
      selectProvimce(id) {
        this.cityarr = [];
        this.regionarr = [];

        this.cityValue = "";
        this.RegionValue = "";
        this.searchForm.cityno = "";      // 巡检系统
        this.searchForm.areano = "";      // 巡检系统

        for (let item of this.provincearr) {
          if (id == item.id) {
            this.cityarr = item.children;
          }
        }
        this.searchForm.provinceno = this.provinceValue.slice(0, 2);
      },
      //选择市
      selectcity(id) {
        this.regionarr = [];
        this.RegionValue = "";
        for (let item of this.cityarr) {
          if (id == item.id) {
            this.regionarr = item.children;
          }
        }
        this.searchForm.cityno = this.cityValue.slice(0, 4);
      },
      //选择区
      selectRegion(id) {
        this.searchForm.areano = this.RegionValue;
      },
      // 切换状态  条件
      selectUnitName6(val){

      },
      // 查询按钮
      querySubmit(){
        let  that = this;
        that.querySubmitForm = Object.assign({}, that.searchForm);
        if (that.querySubmitForm.areano == "") {
          if (that.querySubmitForm.cityno == "") {
            if (that.querySubmitForm.provinceno == "") {
              // console.log("当时选择的是 全国")
              that._getData()
            }
            else {
              // console.log("当时选择的是 省")
              let sheng = that.querySubmitForm.provinceno.toString().padEnd(6,'0')
              let i =  that.maparr1.indexOf(sheng)

              // console.log(that.maparr[i],'当时选择的是 省')
              let p = that.provincesText.indexOf(that.maparr[i])
              // console.log(p,'选择省的区号')
              if (p != -1){
                that.cxdtcsh = that.maparr[i];
                that._getData()
              }else {
                that.$message({
                  message: `暂无 ${that.maparr[i]} 行政区的 json 文件，请通知相关人员添加`,
                  type: 'warning'
                });
              }
            }
          }
          else {
            // console.log("当时选择的是 省 - 市")
            let shi = that.querySubmitForm.cityno.toString().padEnd(6,'0')
            let i =  that.maparr1.indexOf(shi)
            let p = that.provincesText.indexOf(that.maparr[i])
            if (p != -1){
              that.cxdtcsh = that.maparr[i];
              that._getData()
            }else {
              that.$message({
                message: `暂无 ${that.maparr[i]} 行政区的 json 文件，请通知相关人员添加`,
                type: 'warning'
              });
            }
          }
        }
        else {
          // console.log("当时选择的是 省 - 市 - 区/县")
          let qu = that.querySubmitForm.areano.toString().padEnd(6,'0')
          let i =  that.maparr1.indexOf(qu)
          let p = that.provincesText.indexOf(that.maparr[i])
          if (p != -1){
            that.cxdtcsh = that.maparr[i];
            that._getData()
          }else {
            that.$message({
              message: `暂无 ${that.maparr[i]} 行政区的 json 文件，请通知相关人员添加`,
              type: 'warning'
            });
          }

        }

      },
      // 重置 按钮
      beginAdd(){
        let that = this
        that.provincearr= province;    // 所有的 省 市 区  号/名称
        that.cityarr= [];        // 所有的 市
        that.regionarr= [];      // 所有的 区
        that.provinceValue="";  // 省 号
        that.cityValue= "";      // 市区号
        that.RegionValue= "";   // 区/县号
        that.searchForm.provinceno='';
        that.searchForm.cityno='';
        that.searchForm.areano='';
        that.searchForm.disable='';
        that.searchForm.unitid='';

        that.querySubmitForm = Object.assign({}, this.searchForm);
        this.cxdtcsh = "china"
        let dts = this.cxdtcsh
        this.mapaa(dts);
        that._getData()
      },
      // 地图
      mapaa(dt){
        let that = this
        let echarts = require('echarts');
        let ditu = echarts.init(document.getElementById('ditu'));
        // 调用showLoading方法
        ditu.showLoading({
          text: 'loading',
          color: '#c23531',
          textColor: '#000',
          maskColor: 'rgba(255, 255, 255, 0.2)',
          zlevel: 0,
        });
        let  all  = require(`./json/${dt}.json`);
        that.$echarts.registerMap('ALL',all );
        let option = {
          tooltip: {
            show: true,
            trigger: 'item',
            backgroundColor: "rgba(8,65,134,0.9)",
            formatter:function(params, ticket, callback){
              let text = `
                      设备编号：<span style='color:#f0921e'> ${
                      params.data.name
                    }</span></br>
                      设备地址：<span style='color:#f0921e'> ${
                      params.data.address
                    }</span>
              `
              return text;
            }
          },
          title: {
            text: '设备分布图',
          },
          geo: {
            map: 'ALL', // js地图包
            roam: true, // 鼠标滑动改变大小
            type: 'scatter', // 散点图
            zoom: 1.16,
            // 地图文本标签设置
            label: {
              normal: {
                show: true, // 显示市级名称
              }
            }
          },
          series: [
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              symbol: 'circle', // 标记的图形。
              symbolSize: 15, // 标记的大小。
              rippleEffect: {
                period: 4, // 动画速度，值越小，动画越快
                brushType: 'stroke' // 波纹的绘制方式
              },
              // 涟漪文字效果
              label: {
                normal: {     // 点上的名字
                  show: false,
                  // 提示内容
                  formatter: params => {
                    return params.name;
                  },
                  position: 'top', // 提示方向
                  color: '#00a381'
                },
                emphasis: {
                  show: true // 点
                }
              },
              itemStyle: {
                normal: {
                  color: 'orangered' // 点的颜色
                }
              },
              data: that.datas
            }
          ]
        };
        setTimeout(function () {
          // setOption前隐藏loading事件
          ditu.hideLoading();
          ditu.setOption(option,true) //表示重新绘制
        },500)
        window.addEventListener("resize", function() {
          ditu.resize();
        });
        // 下钻其实就是点击事件，切换脚本而已
        ditu.off('click');  // 防止点击触发两次   使用on 注册事件前先使用off，防止事件的 重复注册
        ditu.on('click', function (chinaParam) {
          // 调用showLoading方法
          ditu.showLoading({
            text: 'loading',
            color: '#c23531',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.2)',
            zlevel: 0,
          });
          let csname =  chinaParam.name
          let i = that.maparr.indexOf(csname)
          let hao = that.maparr1[i]
          if (/0000$/.test(hao)) {
            // console.log("当前为省")
            that.querySubmitForm.provinceno = hao.slice(0, 2);
          }
          else if(/00$/.test(hao)){
            // console.log("当前为市")
            that.querySubmitForm.provinceno = hao.slice(0, 2);
            that.querySubmitForm.cityno = hao.slice(0, 4);
          }
          else {
            // console.log("当前为区/县")
            that.querySubmitForm.provinceno = hao.slice(0, 2);
            that.querySubmitForm.cityno = hao.slice(0, 4);
            that.querySubmitForm.areano = hao;
          }
          that._getData()
          // echarts的渲染逻辑是这样的:
          // 如果未实例化则进行实例化过程, 在此期间会在div容器生成一个_echarts_instance_属性, 该属性值其实就是当前
          // echarts的ID, 然后进行后边的渲染操作,
          // 当我们刷新已经实例化的echarts图表时, echarts会先匹配改div容器上的_echarts_instance_属性值是否与实例对象的ID一
          // 样, 如果一样则会在原有的结构上进行渲染, 但是因为我破坏了原有的结构, 所以无法重新渲染出表格内容,
          let option = ditu.getOption();
          let p = that.provincesText.indexOf(csname)
          if (p != -1){
              if (csname == that.cxdtcsh){
                that.$message({
                  message: `当前显示的就是 ${csname} 地图`,
                  type: 'warning'
                });
                setTimeout(function () {
                  // setOption前隐藏loading事件
                  ditu.hideLoading();
                  ditu.setOption(option,true) //表示重新绘制
                },100)
              }
              else {
                that.cxdtcsh = csname
                document.getElementById('ditu').setAttribute('_echarts_instance_', '');
                let  ditus  = require(`./json/${csname}.json`);
                that.$echarts.registerMap('ALL',ditus );
                setTimeout(function () {
                  // setOption前隐藏loading事件
                  ditu.hideLoading();
                  ditu.setOption(option,true) //表示重新绘制
                },100)
              }
            }
          else {
              setTimeout(function () {
                // setOption前隐藏loading事件
                ditu.hideLoading();
              },500)
              that.$message({
                message: `暂无 ${csname} 行政区的 json 文件，请通知相关人员添加`,
                type: 'warning'
              });
            }
        });
      },
      // 返回 中国地图 按钮
      goback(){
        if (this.cxdtcsh != 'china') {
          this.cxdtcsh = "china"
          let dts = this.cxdtcsh
          this.mapaa(dts);
          this.beginAdd()
        }else {
          this.$message('当前在中国地图');
        }
      },
      // 请求数据
      _getData(){
        let that = this;
        that.datas = []
        request({
          url: "base/device/getLocation",
          method: "POST",
          data: {
            provinceno:that.querySubmitForm.provinceno,
            cityno:that.querySubmitForm.cityno,
            areano:that.querySubmitForm.areano,
            disable:that.querySubmitForm.disable,
            unitid:that.querySubmitForm.unitid,
          }
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              let obj = {};
              for (let i = 0; i<response.data.data.length;i++) {
                if (response.data.data[i].location == ''|| response.data.data[i].location == null){

                }else {
                  obj = {};
                  obj.name = response.data.data[i].deviceno
                  let arr =  response.data.data[i].location.split(",")
                  obj.value = []
                  obj.value[0] = parseFloat(arr[0])
                  obj.value[1] = parseFloat(arr[1])
                  obj.address = response.data.data[i].address
                  that.datas.push(obj)
                }

              }
              let dts = that.cxdtcsh
              that.mapaa(dts);
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });

      },
      // 请求数据
      _getPatrolNum(){
        let that = this;
        request({
          url: "base/patrol/getPatrolNum",
          method: "POST",
          data: {
            times:that.times
          }
        })
          .then(function(response) {
            if (response.data.code === 20000) {
              console.log(response,666)
            }
          })
          .catch(function(error) {
            console.log(error, "报错信息");
          });
      }
    },
    watch:{},
    mounted() {
        let dts = this.cxdtcsh
        this.mapaa(dts);
    },
    created() {
      this._getData()
      // this._getPatrolNum()
      this.provincearr = province;    // 地区三级联动
      this.maparr = Object.values(map) ;              // 地区三级联动 名字 巡检系统单独的
      this.maparr1 = Object.keys(map) ;              // 地区三级联动  区号 巡检系统单独的
    },
}
</script>

<style scoped>
  .wrapper{ width: 100%;height: 100%;background-color: #f0f0f0;display: flex;flex-direction: column; }
  .demo-form-inline{ margin-left: 15px }
  .demo-form-inline>*{ padding-top: 15px;box-sizing: border-box }
  #ditu{ width: 100%;flex-grow: 1 }
  .fh{ display: flex;justify-content: center;align-items: center;height: 87px }
  .cx{ height: 69px }


  @media screen and (max-height: 860px) {
    .cx{ height: 135px }
  }
  @media screen and (max-height: 760px) {
    .cx{ height: 135px }
  }

</style>
