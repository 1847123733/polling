// 单位相关的 API 封装
// 1. 导入网络请求
import request from './index'

// 单位管理       分页条件查询
export function sysUnit(data) {
  return request({
    url:'base/sysUnit/list',
    method: "GET",
    params: data,
  })
}
// 单位管理       新增
export function sysUnitadd(data) {
  return request({
    url:'base/sysUnit/add',
    method: "POST",
    data,
  })
}
// 单位管理       修改
export function sysUnitupdate(data) {
  return request({
    url:'base/sysUnit/update',
    method: "PUT",
    data,
  })
}
// 单位管理       删除
export function sysUnitdelete(data) {
  return request({
    url:'base/sysUnit/delete',
    method: "DELETE",
    params:data,
  })
}


// 单位管理      定制查询单位信息查询   所有的单位信息  类型  名称
export function getAllUnitList(data) {
  return request({
    url:'base/sysUnit/getAllUnitList',
    method: "GET",
    params:data,
  })
}


// 用户管理       给用户绑定单位的时候使用   销售请求所有单位信息
export function listpage(data) {
  return request({
    url:'base/sysUnit/listpage',
    method: "GET",
    params: data,
  })
}
