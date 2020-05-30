import request from '@/utils/request'//引入request.js，它封装了axios请求处理

export default{
  /* 分页获取所有讲师列表
   * current 当前页
   * size 每页记录数
   */
  getList(current,size){
     return request({
      url: `/eduservice/limitSelect/${current}/${size}`,//和后台接口地址对应
      method: 'get',//请求方式对应
    })
  },
    /* 根据id删除
     *
     */
    deleteById(id){
      return request({
        url:`/eduservice/deleteById/${id}`,
        method:'delete',
      })
    },
    /* 添加数据*/
    save(data){
      return request({
        url:`/eduservice/insertEduTeacher`,
        method:'post',
        data
      })
    },
    /* 根据id查询数据*/
    selectById(id){
      return request({
        url:`/eduservice/selectById/${id}`,
        method:'get',
      })
    },
    /* 修改数据*/
    updateById(data){
      return request({
        url:`/eduservice/updateEduTeacher`,
        method:'put',
        data
      })
    }
}
