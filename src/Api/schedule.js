// 巡检相关的 API 封装
// 1. 导入网络请求
import request from './index'
// 巡检信息      分页条件查询
export function schedule(data) {
  return request({
    url:'base/schedule/list',
    method: "GET",
    params: data,
  })
}
// 巡检信息     巡检详情查询
export function patrol(data) {
  return request({
    url:'base/schedule/patrol',
    method: "GET",
    params:data
  })
}


// 巡检记录表查询   分页
export function record(data) {
  return request({
    url:'base/schedule/record',
    method: "GET",
    params:data
  })
}

