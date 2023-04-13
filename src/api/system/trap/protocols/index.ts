import request from '/@/utils/request';

// 查询协议类型列表
export function listProtocols(query?:Object) {
    return request({
        url: '/api/v1/system/trap/protocols/list',
        method: 'get',
        params: query
    })
}
// 查询协议类型详细
export function getProtocols(id:number) {
    return request({
        url: '/api/v1/system/trap/protocols/get',
        method: 'get',
        params: {
            id: id.toString()
        }
    })
}
// 新增协议类型
export function addProtocols(data:object) {
    return request({
        url: '/api/v1/system/trap/protocols/add',
        method: 'post',
        data: data
    })
}
// 删除协议类型
export function delProtocols(id:number) {
    return request({
        url: '/api/v1/system/trap/protocols/delete',
        method: 'delete',
        data:{
            ids:[id]
        }
    })
}
