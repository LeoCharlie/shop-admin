/* 
平台属性相关接口
*/
import request from '@/utils/request'

const api_name = '/admin/product'

export default{
    getAttrInfoList(category1Id,category2Id,category3Id){
        return request.get(`${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
    },
    deleteAttr(attrId){
        return request.delete(`${api_name}/deleteAttr/${attrId}`)
    },
    getAttrValueList(attrId){
        return request.get(`${api_name}/getAttrValueList/${attrId}`)
    },
    saveAttrInfo(attrInfo){
        return request.post(`${api_name}/saveAttrInfo`,attrInfo)
    },
}