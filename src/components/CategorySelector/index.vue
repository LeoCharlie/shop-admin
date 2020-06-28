<template>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item label="一级分类">
      <el-select v-model="category1Id" placeholder="请选择" 
        @change="change1List" :disabled="disSelect">
        <el-option :label="c1.name" :value="c1.id"
        v-for="c1 in category1List" :key="c1.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="二级分类">
      <el-select :disabled="disSelect" v-model="category2Id" placeholder="请选择" @change="change2List">
        <el-option :label="c2.name" :value="c2.id"
        v-for="c2 in category2List" :key="c2.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="三级分类">
      <el-select :disabled="disSelect" v-model="category3Id" placeholder="请选择" @change="change3List">
        <el-option :label="c3.name" :value="c3.id"
        v-for="c3 in category3List" :key="c3.id"
        ></el-option>
      </el-select>
    </el-form-item>
    
  </el-form>
</template>

<script>
export default {
  name: 'CategorySelector',
  data() {
    return {
      category1List:[],
      category2List:[],
      category3List:[],
      category1Id:'',
      category2Id:'',
      category3Id:'',
      disSelect: false
    }
  },
  async mounted(){
    this.getCategory1List()
  },
  methods:{
    async getCategory1List(){
      const res = await this.$API.category.getCategorys1()
      this.category1List = res.data
    },
    async change1List(category1Id){
      this.category2List = [];
      this.category2Id = ''
      this.category3List = [];
      this.category3Id = ''
      const res = await this.$API.category.getCategorys2(category1Id)
      this.category2List = res.data

      this.$emit('categoryChange',{categoryId: category1Id, level:1})
    },
    async change2List(category2Id){
      this.category3List = [];
      this.category3Id = ''
      const res = await this.$API.category.getCategorys3(category2Id)
      this.category3List = res.data

      this.$emit('categoryChange',{categoryId: category2Id, level:2})
    },
    change3List(category3Id){
      this.$emit('categoryChange',{categoryId: category3Id, level:3})
    }
  }
}
</script>

<style lang="less" scoped>

</style>
