<template>
  <div>
    <!-- 折叠栏-->
    <div class="app-container">
     <el-collapse @change="handleChange" accordion>
       <el-collapse-item v-for="courseAllInfoVo in courseAllInfoVoList" :title="courseAllInfoVo.title" :name="courseAllInfoVo.id">
         <!-- 折叠内容-->
         <div class="ccInfo">
             <img :src="courseAllInfoVo.cover">
             <div class="main">
               <h2>{{ courseAllInfoVo.title}}&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-switch
                      v-model="courseAllInfoVo.status==='Normal'?true:false"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="switchChange(courseAllInfoVo.id)">
                    </el-switch>{{courseAllInfoVo.status==='Normal'?"已发布":"未发布"}}
               </h2>
               <p class="gray"><span>共{{ courseAllInfoVo.lessonNum }}课时</span></p>
               <p><span>所属分类：{{ courseAllInfoVo.oneTitle }} — {{ courseAllInfoVo.twoTitle }}</span></p>
               <p>课程讲师：{{ courseAllInfoVo.teacherName }}</p>
               <h3 class="red">￥{{ courseAllInfoVo.price }}</h3>
             </div>

           </div>
          <!-- 操作按钮-->
          <el-button type="primary" @click="updateCourse(courseAllInfoVo.id)">修改信息</el-button>
          <el-button type="success" @click="updateChapterVideo(courseAllInfoVo.id)">编辑课程大纲</el-button>
          <el-button type="danger" @click="deleteCourse(courseAllInfoVo.id)">删除课程</el-button>
       </el-collapse-item>
     </el-collapse>
    </div>
      <!-- 分页-->
    <div class="block">
        <el-pagination
          @current-change="limitSelectCourseAllInfoVo"
          :current-page="current"
          :page-size="size"
          layout=" total ,prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
  </div>
</template>

<script>
import eduCourse from '@/api/course/eduCourse.js'
export default {
  data() {
    return {
      courseAllInfoVoList:null,    //数据
      /* 初始化变量*/
      current:1,//表示当前页
      size:5,   //每页记录数
      total:0,
      search:"",//搜索内容
    }
  },
  watch: {
  },
  created() {
    console.log('info created')
    this.init()
  },
  methods: {
    init() {
      this.limitSelectCourseAllInfoVo();
    },
    /* 分页查询课程信息*/
    limitSelectCourseAllInfoVo(current =1){
      this.current=current;
      eduCourse.limitSelectCourseAllInfoVo(this.current,this.size)
      .then(response=>{
          this.courseAllInfoVoList=response.data.courseAllInfoVoMap.courseAllInfoVoList;
          this.total=response.data.courseAllInfoVoMap.total;
      })
    },
    /* 点击折叠面板触发改变事件*/
    handleChange(){
      console.log("11");
    },
    /* 当改变课程发布状态是*/
    switchChange(id){
      this.updateStatus(id)
    },
    /* 根据id修改发布状态*/
    updateStatus(id){
      eduCourse.updateStatus(id)
      .then(response=>{
        //修改成功重新获取信息
        this.limitSelectCourseAllInfoVo();

        this.$message({//提示
          type: 'success',
          message: '修改发布状态!'
        })
      })
      //为了保险，多获取一次
      this.limitSelectCourseAllInfoVo();
    },
    /**=========================按钮==========================================**/
    /* 单击修改信息按钮后*/
    updateCourse(cid){
      this.$router.push({name:"课程添加",params:{id:cid}})
    },
    /* 单击编辑课程大纲按钮后*/
    updateChapterVideo(cid){
      this.$router.push({name:"课程添加2",params:{id:cid}})
    },
    /* 删除课程接口 and 单击删除课程按钮后*/
    deleteCourse(cid){
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                eduCourse.deleteCourseById(cid)
                .then(response=>{
                  this.$message({//提示
                    type: 'success',
                    message: '删除成功!'
                  })
                })
                //刷新页面(为了保险，多刷一次)
                this.limitSelectCourseAllInfoVo();
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
              });
      //刷新页面(为了保险，多刷一次)
      this.limitSelectCourseAllInfoVo();
    }
},
}
</script>
<style>

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
</style>
