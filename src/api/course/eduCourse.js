import request from '@/utils/request'//引入request.js，它封装了axios请求处理

export default{
    /*保存课程信息 */
    saveCourseInfo(courseInfo) {
        return request({
          url: `/eduservice/edu-course/insertCourseInfo`,
          method: 'post',
          data:courseInfo
        })
     },
    /*获取所有讲师*/
    getTeacherList(){
      return request({
        url: `/eduservice/findAll`,
        method: 'get',
      })
    },
  /* 根据课程id获取课程信息*/
  getCourseInfo(id){
    return request({
    	url:`/eduservice/edu-course/selectById/${id}`,
    	method:'get',
    })
  },
  /* 根据数据修改课程信息*/
  updateCourseInfo(courseInfo){
     return request({
     	url:`/eduservice/edu-course/updateCourseInfoVo`,
     	method:'post',
      data:courseInfo
     })
  },


	/* 根据课程id获取章节和小节 */
	getChapterAndVideoById(id){
		return request({
			url:`/eduservice/edu-chapter/selectTree/${id}`,
			method:'get',
		})
	},
  /* 添加章节 */
  insertChapter(chapter){
  	return request({
  		url:`/eduservice/edu-chapter/insertChapter`,
  		method:'post',
      data:chapter
  	})
  },
  /* 根据id查询章节 */
  selectById(id){
    return request({
    	url:`/eduservice/edu-chapter/selectById/${id}`,
    	method:'get',
    })
  },
  /* 修改章节*/
  updateChapter(chapter){
    return request({
    	url:`/eduservice/edu-chapter/updateChapter`,
    	method:'post',
      data:chapter
    })
  },
  /* 删除章节*/
  deleteChapter(id){
    return request({
    	url:`/eduservice/edu-chapter/${id}`,
    	method:'delete'
    })
  },
  /* 添加小节 */
  insertVideo(video){
  	return request({
  		url:`/eduservice/edu-video/insertVideo`,
  		method:'post',
      data:video
  	})
  },
  /* 根据id查询小节 */
  selectVideoById(id){
    return request({
    	url:`/eduservice/edu-video/selectById/${id}`,
    	method:'get',
    })
  },
  /* 修改小节*/
  updateVideo(video){
    return request({
    	url:`/eduservice/edu-video/updateVideo`,
    	method:'post',
      data:video
    })
  },
  /* 删除小节*/
  deleteVideo(id){
    return request({
    	url:`/eduservice/edu-video/${id}`,
    	method:'delete'
    })
  },
  /* 获取所有数据回显*/
  selectCourseAllInfoVoById(id){
    return request({
    	url:`/eduservice/edu-course/selectCourseAllInfoVoById/${id}`,
    	method:'get'
    })
  },
  /* 根据id修改发布状态*/
  updateStatus(id){
    return request({
    	url:`/eduservice/edu-course/updateStatus/${id}`,
    	method:'post'
    })
  },
  /* 分页查询课程信息*/
  limitSelectCourseAllInfoVo(current,size){
    return request({
    	url:`/eduservice/edu-course/limitSelectCourseAllInfoVo/${current}/${size}`,
    	method:'get'
    })
  },
  /* 删除课程*/
  deleteCourseById(id){
    return request({
    	url:`/eduservice/edu-course/deleteCourseById/${id}`,
    	method:'delete'
    })
  },
  /* 删除小节视频*/
  removeById(id) {
      return request({
        url: `/videoservice/${id}`,
        method: 'delete'
      })
    },
}

