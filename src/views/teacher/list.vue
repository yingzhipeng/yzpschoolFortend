<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="70">
        <template slot-scope="scope">
          {{(current-1)*size+scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="70"></el-table-column>
      <el-table-column label="头衔" width="100">
        <template slot-scope="scope" width="100"><!-- scope表示当前整个表中的数据，row表示当前行的数据 -->
          {{ scope.row.level === 1 ?'高级讲师':'首席讲师'}}
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" width="500"></el-table-column>
      <el-table-column prop="gmtCreate" label="注册时间" width="200"></el-table-column>
      <el-table-column prop="sort" label="排序" width="70"></el-table-column>
      <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
              <el-button type="primary"
                size="mini"
                @click="updateById(scope.row.id)">Edit</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteById(scope.row.id)">Delete</el-button>
            </template>
          </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination
          @current-change="getList"
          :current-page="current"
          :page-size="size"
          :total="total"
          layout=" total,prev, pager, next, jumper"
          style="padding:30px 0;text-align: center;"
          >
        </el-pagination>
  </div>
</template>

<script>
  import eduTeacher from '@/api/teacher/eduTeacher.js';//这里多次出现@符号，是因为将@符号封装成了src，也就是说@表示根路径src
export default{
  name:'list',
  data(){
    return{
      /* 初始化变量*/
      current:1,//表示当前页
      size:5,   //每页记录数
      total:0,  //总记录数
      list:null,//存储返回的数据，若想看的里面的数据，在页面输出即可，或者你看后端的json数据
      search:"",//搜索内容
    }
  },
  created() {
    this.getList();
  },
  methods:{
    //讲师列表查询
    getList(current =1)
    {
      this.current=current;
      eduTeacher.getList(this.current,this.size)
      .then(response =>{
        console.log("请求成功,不要试图在这里输出请求后响应的对象response，这是异步，输出只会是一个空对象，它会在响应之前就执行完毕");
        this.list=response.data.limitEduTeacher.records;
        this.total=response.data.limitEduTeacher.total;
      })
      .catch(error=>{
        console.log("请求失败"+error);
      })
    },
    //根据id删除
    deleteById(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        eduTeacher.deleteById(id);
        console.log("请求删除成功");
        this.getList(this.current);//删除成功重新请求，刷新页面
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      })
    },
    //修改数据
    updateById(id){
      this.$router.push({name:'Update',params:{id}})
    }
  }
}
</script>

<style>
</style>
