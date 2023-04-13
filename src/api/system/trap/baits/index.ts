import request from '/@/utils/request';

// 查询诱饵信息列表
export function listBaits(query?:Object) {
    return request({
        url: '/api/v1/system/trap/baits/list',
        method: 'get',
        params: query
    })
}
// 查询诱饵信息详细
export function getBaits(id:number) {
    return request({
        url: '/api/v1/system/trap/baits/get',
        method: 'get',
        params: {
            id: id.toString()
        }
    })
}
// 新增诱饵信息
export function addBaits(data:object) {
    return request({
        url: '/api/v1/system/trap/baits/add',
        method: 'post',
        data: data
    })
}
// 删除诱饵信息
export function delBaits(id:number) {
    return request({
        url: '/api/v1/system/trap/baits/delete',
        method: 'delete',
        data:{
            ids:[id]
        }
    })
}
