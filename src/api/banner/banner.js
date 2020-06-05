import request from '@/utils/request'//引入request.js，它封装了axios请求处理

export default{
    /*获取所有轮播图*/
    getBannerList(){
      return request({
        url: `/cmsservice/crm-banner/after-end/limit/1/6`,
        method: 'get',
      })
    },
    /*修改轮播图*/

    updateById(banner){
      return request({
        url: `/cmsservice/crm-banner/after-end/updateById`,
        method: 'put',
        data:banner,
      })
    },
    /* 添加轮播图*/
    insertBanner(banner){
      return request({
        url: `/cmsservice/crm-banner/after-end/insert`,
        method: 'post',
        data:banner,
      })
    },
}
