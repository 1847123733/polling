// 论坛相关的 API 封装
// 1. 导入网络请求
import request from './index'

// 分页条件查询
export function forumForums(data) {
  return request({
    url:'forumForums/list',
    method: "GET",
    params: data,
  })
}

// 新增论坛
export function forumForumsadd(data) {
  return request({
    url:'forumForums/add',
    method: "POST",
    data,
  })
}

// 修改论坛信息
export function forumForumsupdate(data) {
  return request({
    url:'forumForums/update',
    method: "PUT",
    data,
  })
}

// 删除论坛。
export function forumForumsdelete(data) {
  return request({
    url:'forumForums/delete',
    method: "DELETE",
    params: data,
  })
}
