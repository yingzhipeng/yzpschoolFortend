<template>
    <div class="app-container">
      <el-form label-width="120px">
        <el-form-item label="讲师名称">
          <el-input v-model="teacher.name"/>
        </el-form-item>
        <el-form-item label="讲师排序">
          <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
        </el-form-item>
        <el-form-item label="讲师头衔">
          <el-select v-model="teacher.level" clearable placeholder="请选择">
            <!--
              数据类型一定要和取出的json中的一致，否则没法回填
              因此，这里value使用动态绑定的值，保证其数据类型是number
            -->
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
          </el-select>
        </el-form-item>
        <el-form-item label="讲师资历">
          <el-input v-model="teacher.career"/>
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
        </el-form-item>

        <!-- 讲师头像 -->
        <el-form-item label="讲师头像">
            <!-- 头衔缩略图 -->
            <pan-thumb :image="teacher.avatar"/>
            <!-- 文件上传按钮 单击后imagecropperShow变为true，这控制上传弹窗开启-->
            <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
            </el-button>
            <!--
              v-show：是否显示上传组件
              :key：类似于id，如果一个页面多个图片上传控件，可以做区分
              :url：后台上传的url地址
              @close：关闭上传组件
              @crop-upload-success：上传成功后的回调 -->
            <image-cropper
                           v-show="imagecropperShow"
                           :width="300"
                           :height="300"
                           :key="imagecropperKey"
                           :url="BASE_API+'/ossservice/uploadFile'"
                           field="file"
                           @close="close"
                           @crop-upload-success="cropSuccess"/>
        </el-form-item>


        <!--保存按钮 -->
        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
import eduTeacher from '@/api/teacher/eduTeacher.js'
import imageCropper from '@/components/ImageCropper/index.vue'
import panThumb from '@/components/PanThumb/index.vue'
export default{
  data(){
    return{
      teacher:{
      },
      imagecropperShow:false,//上传弹窗组件是否显示
      imagecropperKey:0,//唯一标识
      BASE_API:process.env.VUE_APP_BASE_API,//将http://localhost:9001赋值给BASE_API
      saveBtnDisabled:false,//保存按钮是否禁用
    }
  },
  created() {
    if(this.$route.params && this.$route.params.id){
      this.selectById(this.$route.params.id);//如果路由中有参数并且参数是id值，则调用selectById方法，查询数据
    }
  },
  methods:{
    /* *
      上传组件
    */
    /* 关闭上传弹窗 */
    close(){
      this.imagecropperShow=false;
      this.imagecropperKey++;
    },
    /* 上传成功*/
    cropSuccess(data){
      this.imagecropperShow=false;
      this.teacher.avatar=data.url;
      this.imagecropperKey++;
    },
    /* 根据id获取数据*/
    selectById(id){
      eduTeacher.selectById(id)
      .then(response =>{
        this.teacher=response.data.eudTeacher;//将数据存储到teacher中
      })
      .catch(error=>{

      })
    },
    /* 添加方法 */
    save(){
      eduTeacher.save(this.teacher)
      .then(response =>{
        //提示信息
        console.log("成功")
        //回到列表显示
        this.$router.push({name:'teacher'})
      })
    },
    /* 修改方法*/
    updateById(){
      eduTeacher.updateById(this.teacher)
      .then(response=>{
        //回到列表显示
        this.$router.push({name:'teacher'})
      })
      .catch(error=>{

      })
    },
    /* 修改和添加，为了可以让修改和添加用同一个页面 */
    saveOrUpdate(){
      if(this.teacher.id){/* 如果teacher对象中有id值，说明是我们请求后的数据，执行的应该是修改 */
        this.updateById();
      }
      else{/* 如果没有，说明我们仅仅添加数据，执行的应该是添加 */
        this.save();
      }
    },
  },
  components:{
    imageCropper,
    panThumb,
  },
}
</script>

<style>
</style>
