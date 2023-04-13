import request from '/@/utils/request';

// 查询协议转发信息列表
export function listProtocolProxies(query?:Object) {
    return request({
        url: '/api/v1/system/proxies/protocolProxies/list',
        method: 'get',
        params: query
    })
}
// 查询协议转发信息详细
export function getProtocolProxies(id:number) {
    return request({
        url: '/api/v1/system/proxies/protocolProxies/get',
        method: 'get',
        params: {
            id: id.toString()
        }
    })
}
// 新增协议转发信息
export function addProtocolProxies(data:object) {
    return request({
        url: '/api/v1/system/proxies/protocolProxies/add',
        method: 'post',
        data: data
    })
}
// 删除协议转发信息
export function delProtocolProxies(id:number) {
    return request({
        url: '/api/v1/system/proxies/protocolProxies/delete',
        method: 'delete',
        data:{
            ids:[id]
        }
    })
}
// 查询蜜罐信息列表
export function listHoneypots(query?:Object) {
    return request({
        url: '/api/v1/system/proxies/protocolProxies/honeypots/list',
        method: 'get',
        params: query
    })
}
// 查询转发端口信息列表
export function listProxyport(query?:Object) {
    return request({
        url: '/api/v1/system/proxies/protocolProxies/proxyport/list',
        method: 'get',
        params: query
    })
}