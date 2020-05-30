<template>
  <div class="app-container">
    <!-- 导航-->
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <!-- 课程标题-->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

       <!-- 所属分类：级联下拉列表 -->

       <el-form-item label="课程类别">
         <!-- 一级分类 -->
         <el-select
           v-model="courseInfo.subjectParentId"
           placeholder="请选择"
           @change="oneSubjectChange(courseInfo.subjectParentId)">
           <el-option
             v-for="subject in oneSubject"
             :key="subject.id"
             :label="subject.title"
             :value="subject.id"
             />
         </el-select>

         <!-- 二级分类 -->
         <el-select v-model="courseInfo.subjectId" placeholder="请选择">
           <el-option
             v-for="subject in twoSubject"
             :key="subject.value"
             :label="subject.title"
             :value="subject.id"/>
         </el-select>
       </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <!-- 总课时-->
      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <Editor id="tinymce" v-model="courseInfo.description" :init="editorInit"></Editor>
        <!-- <el-input v-model="courseInfo.description" placeholder=" 简介信息"/> -->
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/ossservice/uploadFile'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <!-- 课程价格-->
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import eduCourse from '@/api/course/eduCourse.js'//引入api接口
import eduSubject from'@/api/subject/eduSubject.js'
import Editor from '@tinymce/tinymce-vue'
const defaultForm = {//创建默认表单内容对象
  title: '',        //课程标题
  teacherId: '',    //讲师id
  subjectId: '',    //课程分类id
  subjectParentId:'',//课程分类父id
  lessonNum: 0,     //总课时
  description: '',  //课程简介
  cover: 'https://yzpnb-edu-1010.oss-cn-beijing.aliyuncs.com/2020/05/24/4ee93c44bcd14366a67a602813f7b29fu%3D3922344982%2C423380743%26fm%3D26%26gp%3D0.jpg',        //课程封面
  price: 0          //课程价格
}
export default {
  data() {
    return {
      courseInfo: defaultForm,//为数据赋初始值
      saveBtnDisabled: false ,// 保存按钮是否禁用
      oneSubject:[],          //一级分类
      twoSubject:[],          //二级分类
      teacherList:[],         //讲师列表
      BASE_API:process.env.VUE_APP_BASE_API,//将http://localhost:9001赋值给BASE_API
      tinymceHtml:"",
      editorInit:
      {
        language: 'zh_CN',//使用中文
        height: 300,//编辑器大小
        plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu emoticons ',
        toolbar:'bold italic underline strikethrough | image emoticons | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
      },
    }
  },
  components:{
    Editor
  },
  watch: {
    $route(to, from) {//监听路由是否发生变化
      console.log('watch $route')
      this.init()//如果路由改变，调用初始化函数
    },
  },
  created() {//页面加载时，调用初始化函数
    console.log('info created')
    this.init();
    this.getTeacherList();//加载讲师列表
    this.getSubject();//加载课程分类
  },
  methods: {
    /* 初始化函数*/
    init() {
      if (this.$route.params && this.$route.params.id) {//如果当前路由的params有值并且传过来的值是id就执行
        const id = this.$route.params.id//将当前的id值拿出来
        console.log(id)
        //有值就说明是回显的，因为我们第一次添加课程时，是没有id参数的
        eduCourse.getCourseInfo(id)
        .then(response=>{
          this.courseInfo=response.data.courseInfoVo;

          //解决回显数据不显示内容只显示id值(只需要让二级分类有值就可以)
          eduSubject.getList()
          .then(response=>{
            this.oneSubject=response.data.allSubject;//获取一级分类
            for (let i = 0; i < this.oneSubject.length; i++) {//遍历一级分类
              if (this.oneSubject[i].id === this.courseInfo.subjectParentId) {
                  this.twoSubject = this.oneSubject[i].children//找到与回显的id对应的二级分类，赋值
              }
            }
          })
        })

      } else {//若没有值，就直接赋值为默认的初始值
        this.courseInfo = { ...defaultForm }
      }
    },
    /* 上传成功调用*/
    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseInfo.cover = res.data.url
    },
    /* 上传之后调用*/
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    /* 获取课程分类*/
    getSubject(){
      eduSubject.getList()
      .then(response=>{
        this.oneSubject=response.data.allSubject;
      })
    },
    /* 当一级分类发生改变*/
    oneSubjectChange(id){
       for (let i = 0; i < this.oneSubject.length; i++) {
         if (this.oneSubject[i].id === id) {
             this.twoSubject = this.oneSubject[i].children
             this.courseInfo.subjectId = ''
         }
       }
    },
    /* 获取讲师列表*/
    getTeacherList()
    {
      eduCourse.getTeacherList()
      .then(response=>{
        this.teacherList=response.data.allEduTeacher;
      })
    },

    /* 下一步函数*/
    next() {//当点击下一步时
      console.log('next')
      this.saveBtnDisabled = true//让保存按钮可用
      if (!this.courseInfo.id) {//如果现在数据中没有id值
        this.saveData()//执行保存函数
      } else {//执行else说明courseInfo有值，表示是回显，应该执行修改命令
        this.updateCourseInfo()
      }
    },

    // 保存
    saveData() {
      //调用api接口
      eduCourse.saveCourseInfo(this.courseInfo).then(response => {
        this.$message({//提示
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({name:"课程添加2",params:{id:response.data.courseId}})
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },

    updateCourseInfo() {
      eduCourse.updateCourseInfo(this.courseInfo)//进行修改
      .then(response=>{
        this.$message({//提示
          type: 'success',
          message: '修改成功!'
        })
      })
      this.$router.push({name:"课程添加2",params:{id:this.courseInfo.id}})//跳转路由
    }
  }
}
</script>
