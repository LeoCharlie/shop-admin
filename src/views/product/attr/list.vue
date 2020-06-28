<template>
  <div>
    <el-card>
      <CategorySelector ref="cs" @categoryChange="hadleChange"/>
    </el-card>
    <el-card style="margin-top:20px" >
      <div v-show="isShowList">
        <el-button :disabled="!category3Id" type="primary" icon="el-icon-plus" @click="showAdd">添加属性</el-button>
        <el-table
          :data="attrs" 
          v-loading="loading"
          border>
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
            align="center">
          </el-table-column>
          <el-table-column
            label="属性值列表"
            align="center">
            <template slot-scope="{row,$index}">
              <el-tag type="info" v-for="value in row.attrValueList" :key="value.id">
                {{value.valueName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="150">
            <template slot-scope="{row,$index}">
              <HintButton type="primary" icon="el-icon-edit" size="mini" title="编辑" @click="showUpdata(row)"/>
              
              <el-popconfirm :title="`确定删除 ${row.attrName} 吗?`" 
                @onConfirm="deleteAttr(row.id)">
                 <HintButton slot="reference" title="删除属性" type="danger" icon="el-icon-delete" size="mini"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <el-form inline>
          <el-form-item label="属性名">
            <el-input  type="text" placeholder="请输入属性名" v-model="attr.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="!attr.attrName" type="primary" icon="el-icon-plus" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>

        <el-table
          style="margin:20px 0"
          :data = attr.attrValueList
          border>
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            align="center"
            label="属性值名称"
            prop="valueName"
            >
            <template slot-scope="{row, $index}">
              <el-input v-if="row.edit" :ref="$index" v-model="row.valueName" 
              placeholder="请输入名称"
              @blur="toList(row)" @keyup.enter.native="toList(row)"/>
              <span style="display:block" v-else @click="toEdit(row,$index)">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            >
            <template slot-scope="{row, $index}">
              <el-popconfirm :title="`确定删除 ${row.valueName} 吗?`" 
                @onConfirm="attr.attrValueList.splice($index, 1)">
                 <hint-button slot="reference" title="删除" type="danger" icon="el-icon-delete" size="mini"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" :disabled="!attr.attrName || attr.attrValueList.length===0"
        @click="addOrUpdate">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
      

    </el-card>
  </div>
</template>

<script>
import {cloneDeep} from 'lodash'
export default {
  name: 'AttrList',
  data() {
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrs:[],
      loading: false,
      isShowList: true, //fasle显示的是添加界面
      attr:{
        attrName:'',
        attrValueList:[],
        categoryId:'', //三级分类id
        categoryLevel:3
      },
      visible:false
    }
  },
  async mounted () {
    // const result = await this.$API.attr.getList(2, 13, 61)
    // console.log('result', result)
    // this.category1Id = 2
    // this.category2Id = 13
    // this.category3Id = 61
    // this.getAttrs()
  },
  methods:{
    // 分类ID发生改变的回调
    hadleChange({categoryId,level}){
      if(level === 1){
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.attrs = []
      }else if(level === 2){
        this.category3Id = ''
        this.category2Id = categoryId
        this.attrs = []
      }else{
        this.category3Id = categoryId
        // 选择了三级分类才能发请求获取属性列表
        this.getAttrs()
      }
    },
    // 获取属性列表
    async getAttrs(){
      this.loading = true
      const {category1Id, category2Id, category3Id} = this
      const res = await this.$API.attr.getAttrInfoList(category1Id, category2Id, category3Id)
      this.attrs = res.data
      this.loading = false
    },
    // 显示修改界面
    showUpdata(attr){
      // 保存attr
      // this.attr = {...attr}
      this.attr = cloneDeep(attr)
      this.isShowList = false
      
    },
    // 显示添加界面
    showAdd(){
      this.attr = {
        attrName:'',
        attrValueList:[],
        categoryId:'', //三级分类id
        categoryLevel:3
      },
      this.isShowList = false
    },
    addAttrValue(){
      const attrValue={
        attrId : this.attr.id,
        valueName:'',
        edit: true
      }
      this.attr.attrValueList.push(attrValue)
      this.$nextTick(()=>{
        this.$nextTick(() => this.$refs[this.attr.attrValueList.length-1].focus())
      })
    },
    toEdit(attrValue,index){
      if (attrValue.hasOwnProperty('edit')) {
        attrValue.edit = true
      } else { // 如果没有
        this.$set(attrValue, 'edit', true)
      }
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })
    },
    toList(attrValue){
      if(attrValue.valueName.trim()==='') return
      const isRepeat = this.attr.attrValueList
            .filter(value => value.valueName===attrValue.valueName).length===2
      if (isRepeat) {
        this.$message.warning('属性名称不能重复')
        attrValue.valueName = '' // 清除输入
        return
      }
      attrValue.edit = false
    },
    // 添加或更新
    async addOrUpdate(){
      // 准备数据 
      const {attr} = this

      // 在发请求需要对数据进行必要的整理与检查操作
      /* 
      没有指定属性值名称的属性也会提交给后台
      提交的数据中包含没必要的edit属性
      如果一个属性值名称都没有, 也提交了请求
      */
     // 对属性值列表进行过滤: 过滤掉属性值名称为''
      // attr.attrValueList = attr.attrValueList.filter(attrValue => {
      //   if (attrValue.valueName) {
      //     // 删除attrValue对象中的edit属性
      //     delete attrValue.edit
      //     return true
      //   }
      //   return false
      // })

      // 如果attr.attrValueList是空数组, 没有必要发请求, 直接提示
      // if (attr.attrValueList.length===0) {
      //   this.$message.warning('至少指定一个属性值名称')
      //   return
      // }

      // 发添加或更新的请求
      const result= await this.$API.attr.saveAttrInfo(attr)  // attr中有id是更新, 没有id是保存
      
      // 如果成功了
      if (result.code===200) {
        // 提示成功
        this.$message.success('保存属性成功')
        // 显示列表界面
        this.isShowList = true
        // 重新获取属性列表显示
        this.getAttrs()
      } else {
        // 如果失败了, 提示请求失败
        this.$message.error('保存属性失败')
      }
    },
    // 删除属性
    async deleteAttr(id){
      const res = await this.$API.attr.deleteAttr(id)
      if(res.code === 200){
        this.$message.success("删除成功")
        this.getAttrs()
      }else{
        this.$message.error("删除失败")
      }
    }
  },
  watch: {
      isShowList(value){
        this.$refs.cs.disSelect = !value
      }
    },
}
</script>
