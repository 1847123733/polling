
// 静态 / 公共静态 数据
export default {
  namespaced:true,
  state:{
    // 单位类型   -  单位选择 / 用户选择单位时
    util:[
      { index:1,label:'主管单位' },
      { index:2,label:'服务单位' },
      { index:3,label:'管理单位' },
      { index:5,label:'驾校单位' },
    ],
    // 用户状态   -   用户条件查询
    startss:[
      { index:0,zt:'0',label:'正常' },
      { index:1,zt:'1',label:'待审核' },
      { index:2,zt:'2',label:'审核不通过' }
    ],
    // 设备信息   设备类型
    devicetype:[
      { index:1,label:'体检机' },
      { index:2,label:'拍照机' },
      { index:3,label:'会见厅' },
    ],
    // 用户角色   - 用户新增/ 修改时 角色
    juese:[
      { index:1,label:'高级管理员' },
      { index:2,label:'巡检人员' },
      { index:3,label:'地区代理' },
      { index:4,label:'销售/商务人员' },
      { index:5,label:'售后人员' },
    ],
    // 状态  -  设备分布图的 设备状态
    str:[
      { index:1,label:'可用' },
      { index:0,label:'不可用' }
    ],
    // 已经有的json文件
    provincesText : ['上海','临清市','云南','内蒙古','北京','台湾',
      '吉林','四川','城阳区','天津','宁夏','安徽','山东','山西','广东',
      '广西','新疆','江苏','河北','河南','浙江','海南','湖北','湖南',
      '澳门','甘肃','福建','聊城市','西藏','贵州','辽宁','重庆','陕西',
      '青岛市','青海','香港','黑龙江','包头市','赤峰市','阿拉善盟',
      '巴彦淖尔市', '鄂尔多斯市','呼伦贝尔市','通辽市','乌海市',
      '乌兰察布市','锡林郭勒盟','兴安盟'],
    // 巡检报表的月份
    month:[
      { index:1,label:'一月' },
      { index:2,label:'二月' },
      { index:3,label:'三月' },
      { index:4,label:'四月' },
      { index:5,label:'五月' },
      { index:6,label:'六月' },
      { index:7,label:'七月' },
      { index:8,label:'八月' },
      { index:9,label:'九月' },
      { index:10,label:'十月' },
      { index:11,label:'十一月' },
      { index:12,label:'十二月' },
    ]


  },
  getters:{},
  mutations:{

  },
  // 尽量返回一个 promise 对象，组件可以进行
  actions:{

  }
}
