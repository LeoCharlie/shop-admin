<template>
  <div>
    <el-card style="margin-bottom:20px" v-show="!isShowSkuForm">
      <CategorySelector @categoryChange="hadleChange"></CategorySelector>
    </el-card>
    <div v-show="!isShowSpuForm && !isShowSkuForm">
      <el-card>
        <el-button type="primary" icon="el-icon-plus" @click="showSpuAdd">添加SPU</el-button>
        <el-table :data="spuList" border>
          <el-table-column
            label="序号"
            width="80"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SP描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <hint-button
                title="添加SKU"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="showSkuAdd(row)"
              ></hint-button>
              <hint-button
                title="修改SKU"
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showSpuUpdate(row)"
              ></hint-button>
              <hint-button
                title="查看所有SPU"
                type="info"
                icon="el-icon-info"
                size="mini"
                @click="showSkuList(row)"
              ></hint-button>
              <el-popconfirm
                :title="`确定删除 ${row.spuName} 吗?`"
                @onConfirm="deleteSpu(row.id)"
              >
                <hint-button slot="reference" title="删除SPU" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-dialog :title="`${spu.spuName} => SKU列表`" :visible.sync="isShowDialog">
        <el-table :data="skuList" v-loading="isLoading">
          <el-table-column prop="skuName" label="名称"></el-table-column>
          <el-table-column property="price" label="价格(元)"></el-table-column>
          <el-table-column property="weight" label="重量(KG)"></el-table-column>
          <el-table-column label="默认图片">
            <template slot-scope="{row}">
              <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <el-pagination
        :current-page="page"
        :page-sizes="[5, 10, 15]"
        :page-size="limit"
        :total="total"
        layout="prev, pager, next, jumper, ->, sizes, total"
        @current-change="getListInfo"
        @size-change="handleSizeChange"
      />
    </div>
    <SpuForm :visible.sync="isShowSpuForm" ref="spuForm"/>
    <SkuForm v-show="isShowSkuForm" ref="spuForm"
    @success="isShowSkuForm=false" :cancel="() => isShowSkuForm=false"></SkuForm>
  </div>
</template>

<script>
import SpuForm from '@/views/product/components/SpuForm'
import SkuForm from '@/views/product/components/SkuForm'
export default {
  name: "SpuList",
  components:{
    SpuForm,
    SkuForm
  },
  data() {
    return {
      spuList: [],
      total: 0,
      page: 1,
      limit: 5,
      category1Id: "",
      category2Id: "",
      category3Id: "",

      isShowSpuForm: false,
      isLoading: false, 
      isShowDialog: false, 
      spu: {}, 
      skuList:[],
      isShowSkuForm: false
    };
  },
  async mounted() {
    this.category1Id = 2
    this.category2Id = 13
    this.category3Id = 61
    this.getListInfo();
  },
  methods: {
    async getListInfo(page = 1) {
      this.page = page;
      const res = await this.$API.spu.getList(
        page,
        this.limit,
        this.category3Id
      );
      const { records, total } = res.data;
      this.spuList = records;
      this.total = total;
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getListInfo();
    },
    hadleChange({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        (this.spuList = []), (this.total = 0);
      } else if (level === 2) {
        this.category3Id = "";
        this.category2Id = categoryId;
        this.spuList = [];
        this.total = 0;
      } else {
        this.category3Id = categoryId;
        // 选择了三级分类才能发请求获取属性列表
        this.getListInfo();
      }
    },
    // 添加SPU
    showSpuAdd(){
      this.isShowSpuForm = true
      this.$refs.spuForm.initLoadAddData(this.category3Id)
    },
    // 修改SPU
    showSpuUpdate(spu){
      this.isShowSpuForm = true
      this.$refs.spuForm.initLoadUpdateData(spu.id)
    },
    async deleteSpu (spuId) {
      const result = await this.$API.spu.deleteSPU(spuId)
      this.$message.success('删除SPU成功')
      this.getListInfo()
    },
    async showSkuList(spu){
      this.isShowDialog = true
      this.spu = spu
      this.skuList = []
      this.isLoading = true

      const res = await this.$API.sku.getListBySpuId(spu.id)
      this.isLoading = false
      this.skuList = res.data
    },
    showSkuAdd(spu){
      this.isShowSkuForm = true
      spu = {...spu}
      spu.category1Id = this.category1Id
      spu.category2Id = this.category2Id
      this.$refs.spuForm.initLoadAddData(spu)
    }
  }
};
</script>
