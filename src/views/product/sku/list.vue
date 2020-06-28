<template>
  <div>
    <el-table style="width: 100%" :data="skuList" v-loading="loading">
      <el-table-column label="序号" type="index" width="80"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片">
        <template slot-scope="{ row }">
          <div class="info">
            <div class="pic">
              <img
                :src="row.skuDefaultImg"
                alt="商品图片"
                style="width: 80px;"
              />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" prop="price"></el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="{ row, $index }">
          <hint-button
            v-if="row.isSale===0"
            title="上架"
            type="success"
            icon="el-icon-top"
            size="mini"
            @click="upSale(row)"
          ></hint-button>
          <hint-button
            v-if="row.isSale == 1"
            title="下架"
            type="info"
            icon="el-icon-bottom"
            size="mini"
            @click="downSale(row)"
          ></hint-button>
          <hint-button
            title="修改"
            type="primary"
            icon="el-icon-edit"
            size="mini"
          ></hint-button>
          <hint-button
            title="查看详情"
            type="info"
            icon="el-icon-info"
            size="mini"
          ></hint-button>
          <el-popconfirm :title="`确定删除 ${row.spuName} 吗?`"
            @onConfirm="removeSku(row)">
            <hint-button
            slot="reference"
            title="删除"
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></hint-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[8, 16, 32]"
      :page-size="limit"
      :total="total"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: "SkuList",
  data() {
    return {
      page: 1,
      limit: 8,
      skuList: [],
      total: 0,
      loading: false,
    };
  },
  mounted() {
    this.getSkuList(1);
  },
  methods: {
    async getSkuList(page = 1) {
      this.page = page;
      this.loading = true
      const res = await this.$API.sku.getList(this.page, this.limit);
      this.skuList = res.data.records;
      this.total = res.data.total
      this.loading = false
      
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList(1);
    },
    upSale(sku){
      this.$API.sku.onSale(sku.id).then((value) => {
        this.$message.success('上架成功')
        this.getSkuList(this.page)
      })
    },
    downSale(sku){
      this.$API.sku.cancelSale(sku.id).then(result => {
        this.$message.success('下架成功')
        this.getSkuList(this.page)
      })
    },
    removeSku(sku){
      this.$API.sku.remove(sku.id).then((value) => {
        this.$message.success("删除成功")
        this.getSkuList(1)
      })
    }
  }
};
</script>
