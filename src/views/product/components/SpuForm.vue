<template>
  <el-form label-width="100px" v-show="visible">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select placeholder="选择品牌" v-model="spuInfo.tmId">
        <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spuInfo.description"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
        <!-- 
        file-list: 指定显示的图片列表数组 [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
        action: 指定上传图片的路径
        list-type: 指定图片列表的风格样式
        on-preview: 指定点击预览大图的回调函数
        on-remove: 点击删除的回调函数
      -->
      <el-upload
        :file-list="spuImageList"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
        <el-select value=""
            :placeholder="unUsedSaleAttrList.length===0 ? '属性添加完毕' : `还有${unUsedSaleAttrList.length}项未选择`">
            <el-option :label="attr.name" :value="attr.id" v-for="attr in unUsedSaleAttrList" :key="attr.id"></el-option>
        </el-select>
        
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>

        <el-table border style="margin: 20px 0" :data="spuInfo.spuSaleAttrList">
            <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
            <el-table-column label="属性名" prop="saleAttrName" width="150"></el-table-column>
            <el-table-column label="属性值名称列表">
                <template slot-scope="{row, $index}">
                    <el-tag
                    :key="attrValue.id"
                    v-for="(attrValue, index) in row.spuSaleAttrValueList"
                    closable
                    :disable-transitions="false"
                    
                    >
                    {{attrValue.saleAttrValueName}}
                    </el-tag>
                    <el-input
                    class="input-new-tag"
                    v-if="row.edit"
                    size="small"
                    placeholder="名称"
                    @keyup.enter.native="addSpuSaleAttrValue(row, $index)"
                    @blur="addSpuSaleAttrValue(row, $index)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" 
                    >+ 添加</el-button>
                </template>
            </el-table-column>>
            <el-table-column label="操作" width="150">
                <template slot-scope="{row,$index}"> 
                    <hint-button title="删除" type="danger" icon="el-icon-delete" size="mini"></hint-button>
                </template>
            </el-table-column>
      </el-table>

      <el-form-item >
        <el-button type="primary">保存</el-button>
        <el-button @click="back">取消</el-button>
        </el-form-item>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  props:{
    visible: Boolean
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      spuId:'',
      spuInfo:{
        category3Id: null, 
        spuName: '', 
        description: '', 
        tmId: null, // spu的品牌id
        spuSaleAttrList: [], 
        spuImageList: [], 
      },
      spuImageList:[],
      trademarkList:[],
      saleAttrList:[]
    };
  },
  computed: {
    // 未使用的销售属性的数组
    unUsedSaleAttrList () {
      const {saleAttrList} = this
      const {spuSaleAttrList} = this.spuInfo
      const arr = saleAttrList.filter(attr => {
        const spuAttr = spuSaleAttrList.find(spuAttr => spuAttr.saleAttrName===attr.name)
        return !spuAttr
      })
      return arr
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    back(){
        this.$emit('update:visible', false)
    },
    // 获取更新界面需要的数据
    initLoadUpdateData(spuId){
        this.spuId = spuId
        this.getSPUInfo()
        this.getImgList()
        this.getTrademarkList()
        this.getSaleAttrList()
    },
    // 获取添加界面需要的数据
    initLoadAddData(category3Id){
        this.spuInfo.category3Id = category3Id
        this.getTrademarkList()
        this.getSaleAttrList()
    },

    // 1.根据spuId请求获取spuInfo
    async getSPUInfo(){
        const res = await this.$API.spu.getSPU(this.spuId)
        this.spuInfo = res.data
    },
    // 2.根据spuId请求获取spuImageList
    async getImgList(){
        const res = await this.$API.sku.getSpuImageList(this.spuId)
        // 给spuImageList中每个图片对象都添加name和url属性, 属性值为对应的属性值
        const spuImageList = res.data
        spuImageList.forEach(item => {
            item.name = item.imgName
            item.url = item.imgUrl
        })
        this.spuImageList = spuImageList
    },
    // 3.获取所有品牌的列表trademarkList
    async getTrademarkList(){
        const res = await this.$API.trademark.getList()
        this.trademarkList = res.data
    },
    // 4.获取所有销售属性的列表saleAttrList
    async getSaleAttrList () {
        const res = await this.$API.spu.getSaleAttrList()
        this.saleAttrList = res.data
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
