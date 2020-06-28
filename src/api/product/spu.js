/**
 spu相关接口
*/
import request from '@/utils/request'
const baseUrl = '/admin/product'
export default{
    // GET /admin/product/baseSaleAttrList
    // 获取销售属性列表
    getSaleAttrList(){
        return request.get(`${baseUrl}/baseSaleAttrList`)
    },

    // DELETE /admin/product/deleteSpu/{spuId}
    // 删除spu
    deleteSPU(spuId){
        return request.delete(`${baseUrl}/deleteSpu/${spuId}`)
    },

    // GET /admin/product/getSpuById/{spuId}
    // 获取SPU信息
    getSPU(spuId){
        return request.get(`${baseUrl}/getSpuById/${spuId}`)
    },

    // POST /admin/product/saveSpuInfo
    // POST /admin/product/updateSpuInfo
    // 添加没Id ，更新有Id
    addOrUpdate(spuInfo){
        return request.post(`${baseUrl}/${spuInfo.id?updateSpuInfo:saveSpuInfo}`,spuInfo)
    },

    // GET /admin/product/{page}/{limit}
    // 获取分页列表
    getList(page,limit,category3Id){
        return request.get(`${baseUrl}/${page}/${limit}`,{params:{category3Id}})
    }
}