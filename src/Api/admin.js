// 用户相关的 API 封装
// 1. 导入网络请求
import request from './index'
// 登陆用户
export function addAdmin(data) {
  return request({
    url:'auth/login',
    method: "GET",
    params: data,
  })
}
// 退出登陆
export function logOut() {
  return request({
    url: 'auth/logout',
    method: "GET"
  })
}
// 修改密码
export function change(data) {
  return request({
    url: 'auth/changePassword',
    method: "POST",
    params: data,
  })
}


// 用户管理    分页条件查询
export function sysUser(data) {
  return request({
    url: 'base/sysUser/list',
    method: "GET",
    params: data,
  })
}
// 用户管理    新增用户
export function sysUseradd(data) {
  return request({
    url: 'base/sysUser/add',
    method: "POST",
    data
  })
}
// 用户管理    修改用户信息
export function sysUserupdate(data) {
  return request({
    url: 'base/sysUser/update',
    method: "PUT",
    data
  })
}
// 用户管理    删除用户
export function sysUserdelete(data) {
  return request({
    url: 'base/sysUser/delete',
    method: "DELETE",
    params:data
  })
}
// 查询所有用户
export function getallUser(data) {
  return request({
    url: 'mini/getallUser',
    method: "GET",
    params:data
  })
}




// 用户审核   分页查询
export function sysUsergetReview(data) {
  return request({
    url: 'base/sysUser/getReview',
    method: "GET",
    params:data
  })
}
// 用户审核   审核结果上传
export function sysUserreview(data) {
  return request({
    url: 'base/sysUser/review',
    method: "POST",
    data
  })
}


// 用户管理   获取销售人员负责的单位
// 通过销售人员 id 查询他负责的单位。
export function saleuser(data) {
  return request({
    url: 'base/sysUser/saleuser',
    method: "GET",
    params: data
  })
}
// 用户管理   给销售人员添加负责单位
// 给销售人员添加负责的单位。
export function saleadd(data) {
  return request({
    url: 'base/sysUser/saleadd',
    method: "POST",
    params: data
  })
}
// 用户管理   取消销售人员的负责单位
// 给销售人员取消负责的单位。
export function salecancel(data) {
  return request({
    url: 'base/sysUser/salecancel',
    method: "POST",
    params: data
  })
}



