<template>
  <div class="app-container">
    <!-- 导航-->
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <!-- 课程大纲 -->
    <el-button type="text" @click="openDialog(0)">添加章节</el-button>

    <ul class="chanpterList">
        <li
            v-for="chapter in list"
            :key="chapter.id">
            <p>
                {{ chapter.title }}
                <span class="acts">
                    <el-button type="text" @click="openVideoDialog(0,chapter.id)">添加课时</el-button>
                    <el-button style="disabled=true" type="text" @click="openDialog(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
                </span>
            </p>
            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text" @click="openVideoDialog(video.id,chapter.id)">编辑</el-button>
                            <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>

    <!-- 添加和修改章节表单-->
    <el-dialog :visible.sync="dialogChapterFormVisible" :title="dialogTitle">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
            <el-upload
                   :on-success="handleVodUploadSuccess"
                   :on-remove="handleVodRemove"
                   :before-remove="beforeVodRemove"
                   :on-exceed="handleUploadExceed"
                   :file-list="fileList"
                   :action="BASE_API+'/videoservice/uploadVideo'"
                   :limit="1"
                   class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
                <div slot="content">最大支持1G，<br>
                    支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                    GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                    MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                    SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                <i class="el-icon-question"/>
            </el-tooltip>
            </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 按钮-->
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import eduCourse from '@/api/course/eduCourse.js'
  const defaultChapter={//封装章节默认数据
        title:'',       //章节名称
        sort:1,         //排序,默认为1
        courseId:0      //课程id
      };
  const defaultVideo={  //封装小节默认数据
        title:'1',       //小节名称
        sort:1,
        courseId:0,     //课程id
        chapterId:0,    //章节id
        play_count:0,   //播放次数
        isFree:1,       //是否可以试听,0收费，1免费
        duration:0,     //视频时长
        status:'',      //视频转码 Transcoding转码中  Normal正常
        size:0,         //视频源文件字节
        videoSourceId:'',//阿里云视频id
        videoOriginalName:'',//源文件名
  };
export default {
  data() {
    return {
      saveBtnDisabled: false ,        // 保存按钮是否禁用
      list:[],                        //数据
      dialogChapterFormVisible:false, //章节弹窗初始不显示
      dialogVideoFormVisible:false,   //小节弹窗初始不显示
      saveVideoBtnDisabled:false,     //小节弹窗中确定按钮是否可用
      chapter:defaultChapter,         //封装章节数据
      video:defaultVideo,             //封装小节数据
      flag:0,                         //用于判断是添加还是修改操作，0为添加，其它值为修改(因为我会把需要修改的章节id传过来)
      videoFlag:0,                    //用于判断小节是添加还是修改操作
      dialogTitle:"添加章节",
      videoDialogTitle:"添加小节",
      BASE_API:process.env.VUE_APP_BASE_API,//将http://localhost:9001赋值给BASE_API
      fileList:[],
    }
  },
  created() {
    console.log('chapter created')
    if(this.$route.params.id && this.$route.params){//若路由中有参数，并且参数名为id就执行
      this.getChapterAndVideoById(this.$route.params.id)//现在可以使用完善的喽
    }
  },
  methods: {
  /**==================================初始化页面，public========================================**/
    /* 根据课程id查询章节和小节*/
    getChapterAndVideoById(id){
      eduCourse.getChapterAndVideoById(id)
      .then(response=>{
        this.list=response.data.chapterAndVideo
       })
    },
  /**===================================视频上传操作==============================================**/
  //上传成功回调
  handleVodUploadSuccess(response, file, fileList) {
    this.video.videoSourceId = response.data.videoId//为数据库的阿里云视频id赋值
    this.video.videoOriginalName=file.name;//将组件中上传文件的名称给video中赋值
  },
  //上传开始之前调用，视图上传多于一个视频
  handleUploadExceed(files, fileList) {
    this.$message.warning('想要重新上传视频，请先删除已上传的视频')
  },
  
  /* 删除之前调用，也就是点击了删除按钮，这时弹窗提示用户是否确定删除*/
  beforeVodRemove(file, fileList) {
    return this.$confirm(`确定移除 ${file.name}？`)
  },
  /* 删除视频时调用，当用户点击了删除按钮后，又点击了弹窗中的确定按钮，则调用此方法*/
  handleVodRemove(file, fileList) {
    console.log(file)
    eduCourse.removeById(this.video.videoSourceId).then(response=>{
      this.$message({
        type: 'success',
        message: response.message
      })
      this.fileList=[];//表示现在上传表中内容清空
      this.video.videoSourceId = ''//为数据库的阿里云视频id赋值
      this.video.videoOriginalName=''//将组件中上传文件的名称给video中赋值
    })
  },
  /**===================================小节操作函数==============================================**/
  /* 开启弹窗 */
  openVideoDialog(videoFlag,chapterId){
    this.dialogVideoFormVisible=true;//开启弹窗

    //将video重新赋值
    this.video={...defaultVideo};
    //获取当前章节id
    this.video.chapterId=chapterId;

    this.VideoDialogTitle="添加小节";
    //判断是添加还是修改
    this.videoFlag=videoFlag
    if(!(videoFlag===0)){//不等于0表示修改，根据小节id查出数据保存，实现回显
      this.VideoDialogTitle="修改小节";
      eduCourse.selectVideoById(videoFlag)
      .then(response=>{
        this.video=response.data.video;//将查出的数据保存
      })
    }
  },
  /* 点击弹窗确认按钮后*/
  saveOrUpdateVideo(){
    if(this.videoFlag===0){//为0表示添加
      this.insertVideo();
    }else{//表示为修改操作
      this.updateVideo();
    }
    //1、关闭弹窗(多关一次)
    this.dialogVideoFormVisible = false;
    //刷新页面(为了保险，多刷一次)
    this.getChapterAndVideoById(this.$route.params.id)
  },
  /* 添加小节*/
  insertVideo(){
    eduCourse.insertVideo(this.video)
    .then(response=>{
      //获取课程id
      this.video.courseId=this.$route.params.id;
      //执行添加操作
      eduCourse.insertVideo(this.video)
      .then(response=>{
        //1、关闭弹窗
        this.dialogVideoFormVisible = false;
        //2、提示信息
        this.$message({//提示
          type: 'success',
          message: '添加成功!'
        })
      })
      //刷新页面(为了保险，多刷一次)
      this.getChapterAndVideoById(this.$route.params.id)
    })
  },
  /* 修改小节*/
  updateVideo(){
    eduCourse.updateVideo(this.video)
    .then(response=>{
      //1、关闭弹窗
      this.dialogChapterFormVisible = false;
      //2、提示信息
      this.$message({//提示
        type: 'success',
        message: '修改成功!'
      })
    })
    //刷新页面(为了保险，多刷一次)
    this.getChapterAndVideoById(this.$route.params.id)
  },
  /* 删除小节*/
  deleteVideo(id){
    this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              eduCourse.deleteVideo(id)
              .then(response=>{
                this.$message({//提示
                  type: 'success',
                  message: '删除成功!'
                })
              })
              //刷新页面(为了保险，多刷一次)
              this.getChapterAndVideoById(this.$route.params.id)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
              //刷新页面(为了保险，多刷一次)
              this.getChapterAndVideoById(this.$route.params.id)
            });
    //刷新页面(为了保险，多刷一次)
    this.getChapterAndVideoById(this.$route.params.id)
  },
  /**===================================章节操作函数==============================================**/
    /* 开启弹窗*/
    openDialog(flag){
      this.dialogChapterFormVisible = true;
      //将chapter重新赋值
      this.chapter={...defaultChapter};
      this.dialogTitle="添加章节";
      //判断是添加还是修改
      this.flag=flag;
      if(!(flag===0)){//如果是修改操作
        this.dialogTitle="修改章节";
        //乐观锁，先查数据
        eduCourse.selectById(flag)
        .then(response=>{
          this.chapter=response.data.chapter;//将查出的数据保存起来
        })
      }
    },
    /* 点击确定按钮后*/
    saveOrUpdate(){
      if(this.flag===0){//id
        this.insertChapter();
      }else{//其它值表示修改操作（传的就是章节id
        this.updateChapter(this.flag);
      }
      //3、刷新页面(为了保险，多刷一次)
      this.getChapterAndVideoById(this.$route.params.id)
    },
    /*添加操作 */
    insertChapter(){
      this.chapter.courseId=this.$route.params.id//将课程id给章节对象中
      eduCourse.insertChapter(this.chapter)
      .then(response=>{
        //1、关闭弹窗
        this.dialogChapterFormVisible = false;
        //2、提示信息
        this.$message({//提示
          type: 'success',
          message: '添加成功!'
        })
      })
      //刷新页面(为了保险，多刷一次)
      this.getChapterAndVideoById(this.$route.params.id)
    },
    /* 修改操作*/
    updateChapter(){
      eduCourse.updateChapter(this.chapter)
      .then(response=>{
        //1、关闭弹窗
        this.dialogChapterFormVisible = false;
        //2、提示信息
        this.$message({//提示
          type: 'success',
          message: '修改成功!'
        })
      })
      //刷新页面(为了保险，多刷一次)
      this.getChapterAndVideoById(this.$route.params.id)
    },
    /* 删除*/
    deleteChapter(id){
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                eduCourse.deleteChapter(id)
                .then(response=>{
                  this.$message({//提示
                    type: 'success',
                    message: '删除成功!'
                  })
                })
                //刷新页面(为了保险，多刷一次)
                this.getChapterAndVideoById(this.$route.params.id)
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                })
                //刷新页面(为了保险，多刷一次)
                this.getChapterAndVideoById(this.$route.params.id)
              });
      //刷新页面(为了保险，多刷一次)
      this.getChapterAndVideoById(this.$route.params.id)
    },

    previous() {
      console.log('previous')
      this.$router.push({name:"课程添加",params:{id:this.$route.params.id}})
    },
    next() {
      console.log('next')
      this.$router.push({name:"课程添加3",params:{id:this.$route.params.id}})
    }
  }
}
</script>
<style>
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
.chanpterList p{
  /* float: left; */
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  /* float: left; */
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
