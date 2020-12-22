// 设备相关的 API 封装
// 1. 导入网络请求
import request from './index'
// 设备管理      分页条件查询
export function device(data) {
  return request({
    url:'base/device/list',
    method: "GET",
    params: data,
  })
}
// 设备管理      新增
export function deviceadd(data) {
  return request({
    url:'base/device/add',
    method: "POST",
    data
  })
}
// 设备管理     修改
export function deviceupdate(data) {
  return request({
    url:'base/device/update',
    method: "PUT",
    data
  })
}
// 设备管理     删除
export function devicedelete(data) {
  return request({
    url:'base/device/delete',
    method: "DELETE",
    params: data
  })
}



// 获取设备列表的接口  点位获取设备分页信息
export function listpage(data) {
  return request({
    url:'base/device/listpage',
    method: "GET",
    params: data,
  })
}
