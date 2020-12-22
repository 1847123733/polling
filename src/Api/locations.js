// 点位相关的 API 封装
// 1. 导入网络请求
import request from './index'
// 点位管理      分页条件查询
export function locations(data) {
  return request({
    url:'base/locations/list',
    method: "GET",
    params: data,
  })
}
// 点位管理      新增
export function locationsadd(data) {
  return request({
    url:'base/locations/add',
    method: "POST",
    data
  })
}
// 点位管理     修改
export function locationsupdate(data) {
  return request({
    url:'base/locations/update',
    method: "PUT",
    data
  })
}
// 点位管理     删除
export function locationsdelete(data) {
  return request({
    url:'base/locations/delete',
    method: "DELETE",
    params: data
  })
}

// 点位管理     查询已绑定设备接口  点位所有相关的设备
export function locationshasbind(data) {
  return request({
    url:'base/locations/hasbind',
    method: "GET",
    params: data
  })
}
// 点位管理     绑定设备  点位绑定相关设备
export function locationsbinding(data) {
  return request({
    url:'base/locations/binding',
    method: "POST",
    params: data
  })
}
// 点位管理     解绑设备  点位解绑设备  一个一个的
export function locationsunbind(data) {
  return request({
    url:'base/locations/unbind',
    method: "POST",
    params: data
  })
}


// 点位     用于小程序移动端查询设备信息   所有点位信息
export function getallLocations(data) {
  return request({
    url:'mini/getallLocations',
    method: "GET",
    params: data
  })
}


