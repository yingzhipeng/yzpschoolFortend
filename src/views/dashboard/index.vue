<template>
  <div class="dashboard-container">
    <div class="dashboard-text" >你好: {{ name }}</div>
      <h3>首页轮播图展示：单击图片修改轮播内容</h3>

      <el-button type="primary" icon="el-icon-edit" @click="clickInsertButton"></el-button>
      <el-button type="primary" icon="el-icon-delete"></el-button>

      <el-carousel :interval="4000" type="card" height="240px" style="width: 1200px;">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <el-image :src="banner.imageUrl" @click="clickImage(banner)" style="width: 600px;height: 240px;"></el-image>
        </el-carousel-item>
      </el-carousel>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import banner from '@/api/banner/banner.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      BASE_API:process.env.VUE_APP_BASE_API,//将http://localhost:9001赋值给BASE_API
      dialogChapterFormVisible:false,
      banners: [],
      url:{},
      flag:true,//true表示修改，false表示添加
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
