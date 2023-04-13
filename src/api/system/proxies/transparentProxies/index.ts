import request from '/@/utils/request';

// 查询透明转发信息列表
export function listTransparentProxies(query:Object) {
    return request({
        url: '/api/v1/system/proxies/transparentProxies/list',
        method: 'get',
        params: query
    })
}
// 查询透明转发信息详细
export function getTransparentProxies(id:number) {
    return request({
        url: '/api/v1/system/proxies/transparentProxies/get',
        method: 'get',
        params: {
            id: id.toString()
        }
    })
}
// 新增透明转发信息
export function addTransparentProxies(data:object) {
    return request({
        url: '/api/v1/system/proxies/transparentProxies/add',
        method: 'post',
        data: data
    })
}
// 删除透明转发信息
export function delTransparentProxies(id:number) {
    return request({
        url: '/api/v1/system/proxies/transparentProxies/delete',
        method: 'delete',
        data:{
            ids:[id]
        }
    })
}
