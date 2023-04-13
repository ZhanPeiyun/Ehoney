import request from '/@/utils/request';

// 查询镜像信息列表
export function listImages(query?:Object) {
    return request({
        url: '/api/v1/system/trap/images/list',
        method: 'get',
        params: query
    })
}
// 查询镜像信息详细
export function getImages(id:number) {
    return request({
        url: '/api/v1/system/trap/images/get',
        method: 'get',
        params: {
            id: id.toString()
        }
    })
}
// 新增镜像信息
export function addImages(data:object) {
    return request({
        url: '/api/v1/system/trap/images/add',
        method: 'post',
        data: data
    })
}
// 删除镜像信息
export function delImages(id:number) {
    return request({
        url: '/api/v1/system/trap/images/delete',
        method: 'delete',
        data:{
            ids:[id]
        }
    })
}
