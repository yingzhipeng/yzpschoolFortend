<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
   import eduSubject from '@/api/subject/eduSubject.js'
export default {

  data() {
    return {
      filterText: '',
      data2:[],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
   this.getList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    getList(){
      eduSubject.getList()
       .then(response =>{
         console.log(response.data.allSubject)
          this.data2=response.data.allSubject;
       });
    },
  }
}
</script>
