import request from '@/utils/request'//引入request.js，它封装了axios请求处理

export default{
    /*
      树形获取课程
     */
    getList(){
       return request({
        url: `/eduservice/edu-subject/selectTree`,//和后台接口地址对应
        method: 'get',//请求方式对应
      })
    },
}
