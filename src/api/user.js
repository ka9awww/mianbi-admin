import request from '../utils/request'
import router from '../router'

// 登录验证
export function login(data) {
    return request({
        method: 'POST',
        url: '/auth/login',
        data,
    })
}

// 用户列表
export function getUsers(params = {}) {
    const token = localStorage.getItem('token')
    return request({
        method: 'GET',
        url: '/users',
        params,
    })
}

// 用户详情
export function getUser(id) {
    return request({
        method: 'GET',
        url: `/users/${id}`,
    })
}

// 创建用户
export function createUser(data) {
    return request({
        method: 'POST',
        url: '/users',
        data,
    })
}

// 更新用户
export function updateUser(id, data) {
    return request({
        method: 'PUT',
        url: `/users/${id}`,
        data,
    })
}

// 删除用户
export function deleteUser(id) {
    return request({
        method: 'DELETE',
        url: `/users/${id}`,
    })
} 