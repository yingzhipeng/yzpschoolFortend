<template>
  <div class="dashboard-container">
    <div class="dashboard-text" >你好: {{ name }}</div>
    <!-- 轮播图开始-->
      <h3>首页轮播图展示：单击图片修改轮播内容</h3>

      <el-button type="primary" icon="el-icon-edit" @click="clickInsertButton"></el-button>
      <el-button type="primary" icon="el-icon-delete"></el-button>

      <el-carousel :interval="4000" type="card" height="240px" style="width: 1200px;">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <el-image :src="banner.imageUrl" @click="clickImage(banner)" style="width: 600px;height: 240px;"></el-image>
        </el-carousel-item>
      </el-carousel>
     <!-- 轮播图结束-->
     <!-- 弹窗开始-->
      <el-dialog :visible.sync="dialogChapterFormVisible">
          <el-form :model="url" label-width="120px">
            <el-upload
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :action="BASE_API+'/ossservice/uploadFile'"
              class="avatar-uploader">
              <img :src="url.imageUrl" style="width: 50%;">
            </el-upload>
            <br />
            <br />
            <br />
            <el-form-item label="轮播名字">
                <el-input v-model="url.title" :min="0" controls-position="center"/>
            </el-form-item>
              <el-form-item label="轮播排序">
                  <el-input-number v-model="url.sort" :min="0" controls-position="center"/>
              </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
          </div>
      </el-dialog>
      <!-- 弹窗结束-->
      <!-- 统计表单开始-->
      <div class="app-container">
        <!--表单-->
        <el-form :inline="true" class="demo-form-inline">

          <el-form-item label="日期">
            <el-date-picker
              v-model="day"
              type="date"
              placeholder="选择要统计的日期"
              value-format="yyyy-MM-dd" />
          </el-form-item>

          <el-button
            :disabled="btnDisabled"
            type="primary"
            @click="create()">立即统计数据（每天00:00会统计数据，您可以现在立即生成）</el-button>
        </el-form>

      </div>
      <!-- 统计表单结束-->

      <!-- 图表表单开始 -->
      <div class="app-container">
      <!--表单-->
      <el-form :inline="true" class="demo-form-inline">

        <el-form-item>
          <el-select v-model="searchObj.type" clearable placeholder="请选择">
            <el-option label="学员登录数统计" value="login_num"/>
            <el-option label="学员注册数统计" value="register_num"/>
            <el-option label="课程播放数统计" value="video_view_num"/>
            <el-option label="每日课程数统计" value="course_num"/>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="searchObj.begin"
            type="date"
            placeholder="选择开始日期"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchObj.end"
            type="date"
            placeholder="选择截止日期"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-button
          :disabled="btnDisabled"
          type="primary"
          icon="el-icon-search"
          @click="showChart()">查询</el-button>
      </el-form>

      <div class="chart-container">
        <div id="chart" class="chart" style="height:500px;width:100%" />
      </div>
    </div>
    <!-- 图表表单结束-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import banner from '@/api/banner/banner.js'
import daily from '@/api/statistics/index.js'
import echarts from 'echarts'
export default {
  name: 'Dashboard',
  data() {
    return {
      BASE_API:process.env.VUE_APP_BASE_API,//将http://localhost:9001赋值给BASE_API
      dialogChapterFormVisible:false,
      banners: [],
      url:{},
      flag:true,//true表示修改，false表示添加
      day: '',//代表日期
      btnDisabled: false,//生成按钮是否可用

      searchObj: {//表单数据
        type: '',//查询类型
        begin: '',//起始时间
        end: ''//结束时间
      },
      btnDisabled2: false,  //查询按钮是否可用
      chart: null,          //用来存储dom节点（Html标签）
      title: '',            //图表标题
      xData: [],            //x坐标轴数据，（我们项目x轴是时间）
      yData: []             //y坐标轴数据，（我们项目y轴是统计数据）
    }
  },
  created() {
    this.init();
  },
  methods:{
    /* 初始化函数*/
    init(){
      this.getBannerList();
    },
/**========================================统计图表==============================================**/
     /* 获取统计数据 */
     create() {
         this.btnDisabled = true
         daily.createStatistics(this.day).then(response => {
           this.btnDisabled = false
           this.$message({
             type: 'success',
             message: '生成成功'
           })
         })
       },

     /* 点击查询按钮后，展示图表*/
     showChart() {
       this.initChartData()
     },

     // 准备图表数据
     initChartData() {
        daily.showChart(this.searchObj).then(response => {
            // 数据
            this.yData = response.data.dataList

            // 横轴时间
            this.xData = response.data.timeList

            // 当前统计类别
            switch (this.searchObj.type) {
              case 'register_num':
                this.title = '学员注册数统计'
                break
              case 'login_num':
                this.title = '学员登录数统计'
                break
              case 'video_view_num':
                this.title = '课程播放数统计'
                break
              case 'course_num':
                this.title = '每日课程数统计'
                break
            }

            this.setChart()
          })
     },

     // 设置图标参数
     setChart() {
       // 基于准备好的dom，初始化echarts实例
       this.chart = echarts.init(document.getElementById('chart'))
       // console.log(this.chart)

       // 指定图表的配置项和数据
       var option = {
         // x轴是类目轴（离散数据）,必须通过data设置类目数据
         xAxis: {
             type: 'category',
             data: this.xData//-------绑定数据
         },
         // y轴是数据轴（连续数据）
         yAxis: {
             type: 'value'
         },
         // 系列列表。每个系列通过 type 决定自己的图表类型
         series: [{
             // 系列中的数据内容数组
             data: this.yData,//-------绑定数据
             // 折线图
             type: 'line'
         }],
         title: {
             text: this.title
         },
         tooltip: {
             trigger: 'axis'
         },
         dataZoom: [{
           show: true,
           height: 30,
           xAxisIndex: [
             0
           ],
           bottom: 30,
           start: 10,
           end: 80,
           handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
           handleSize: '110%',
           handleStyle: {
             color: '#d3dee5'

           },
           textStyle: {
             color: '#fff'
           },
           borderColor: '#90979c'
         },
         {
           type: 'inside',
           show: true,
           height: 15,
           start: 1,
           end: 35
         }],
       }

       this.chart.setOption(option)
     },
/**========================================轮播图=========================================**/
    /* 获取轮播图*/
    getBannerList(){
      banner.getBannerList()
      .then(response=>{
          this.banners=response.data.banners;
      })
    },
    /*修改轮播图*/
    updateById(){
      banner.updateById(this.url)
      .then(response=>{
        this.$message({//提示
          type: 'success',
          message: '修改成功!',
        })
        this.getBannerList();
      });
    },
    /* 添加轮播图*/
    insertBanner(){
      banner.insertBanner(this.url)
      .then(response=>{
        this.$message({//提示
          type: 'success',
          message: '添加成功!'
        })
      })
    },
    /* 点击添加按钮后*/
    clickInsertButton(){
      if(this.banners.length<6){//最多六个轮播
        this.flag=false;//表示添加操作
        this.url={};//将url清空
        this.url.imageUrl="https://yzpnb-edu-1010.oss-cn-beijing.aliyuncs.com/2020/06/01/bdba970926a24245bf1f1362f7c8c0c2banner-2-green.jpg";
        this.url.title="你需要输入轮播名字才能上传图片，并预览"
        this.dialogChapterFormVisible=true;//开弹窗
      }else{
        this.$message({//提示
          type: 'error',
          message: '轮播不可多于6个!'
        })
      }
    },
    /*点击图片后*/
    clickImage(banner){//将当前轮播对象传过来
      this.flag=true;//表示修改
      this.dialogChapterFormVisible=true//弹出弹窗
      this.url=banner;//将当前对象给url
    },
    /* 上传成功调用*/
    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.url.imageUrl = res.data.url
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
    /* 点击确定按钮后*/
    saveOrUpdate(){
      if(this.flag===true){
        this.dialogChapterFormVisible=false;//关闭弹窗
        this.updateById();//修改轮播
      }else{
        this.insertBanner()//添加
        this.dialogChapterFormVisible=false;//关闭弹窗
        this.getBannerList();//刷新轮播
      }
      //3、刷新页面(为了保险，多刷一次)
      this.init();
    },
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
