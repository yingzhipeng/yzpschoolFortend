import request from '@/utils/request'//引入request.js，它封装了axios请求处理

export default{
    /*根据日期获取统计数据 */
    createStatistics(day) {
        return request({
          url: `statistics_service/statistics-daily/${day}`,
          method: 'post',
        })
    },
    /* 根据起始时间，结束时间，统计数据类型获取数据 */
    showChart(searchObj) {
        return request({
            url: `/statistics_service/statistics-daily/show-chart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
            method: 'get'
        })
    }
}
