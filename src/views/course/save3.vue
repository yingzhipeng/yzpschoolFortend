<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <div class="ccInfo">
        <img :src="courseAllInfoVo.cover">
        <div class="main">
          <h2>{{ courseAllInfoVo.title }}</h2>
          <p class="gray"><span>共{{ courseAllInfoVo.lessonNum }}课时</span></p>
          <p><span>所属分类：{{ courseAllInfoVo.oneTitle }} — {{ courseAllInfoVo.twoTitle }}</span></p>
          <p>课程讲师：{{ courseAllInfoVo.teacherName }}</p>
          <h3 class="red">￥{{ courseAllInfoVo.price }}</h3>
        </div>
      </div>
      <ul class="chanpterList">
          <li
              v-for="chapter in list"
              :key="chapter.id">
              <p>{{ chapter.title }}</p>
              <!-- 视频 -->
              <ul class="chanpterList videoList">
                  <li
                      v-for="video in chapter.children"
                      :key="video.id">
                      <p>{{ video.title }}</p>
                  </li>
              </ul>
          </li>
      </ul>
    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>
<script>
  import eduCourse from '@/api/course/eduCourse.js'
export default {
  data() {
    return {
      saveBtnDisabled: false ,// 保存按钮是否禁用
      courseAllInfoVo:{},             //初始化数据
      list:[],                        //数据
    }
  },
  created() {
    console.log('publish created')
    this.init()
  },
  methods: {
    /* 初始化*/
    init(){
      this.selectCourseAllInfoVoById(this.$route.params.id)
      this.getChapterAndVideoById(this.$route.params.id)
    },
    /* 获取所有数据回显*/
    selectCourseAllInfoVoById(id){
      eduCourse.selectCourseAllInfoVoById(id)
      .then(response=>{
        this.courseAllInfoVo=response.data.courseAllInfoVo
      })
    },
    /* 根据课程id查询章节和小节*/
    getChapterAndVideoById(id){
      eduCourse.getChapterAndVideoById(id)
      .then(response=>{
        this.list=response.data.chapterAndVideo
       })
    },
    /* 根据id修改发布状态*/
    updateStatus(){
      eduCourse.updateStatus(this.$route.params.id)
      .then(response=>{
        this.$message({//提示
          type: 'success',
          message: '成功!'
        })
      })
    },
    previous() {
      console.log('previous')
      this.$router.push({name:"课程添加2",params:{id:this.$route.params.id}})
    },
    publish() {
      console.log('publish')
      this.updateStatus();
      this.$router.push({name:"课程展示"})
    }
  }
}
</script>
<style scoped>
.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 520px;
}
.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    border: 0;
}
.chanpterList li{
  position: relative;
}
.videoList{
  padding-left: 50px;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
