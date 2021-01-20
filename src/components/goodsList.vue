<template>
  <div>
  <el-toast :title="['商品管理','商品列表']" :data="arr" :data-name="dataName"
            :page-obj="queryInfo" @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange">
    <input-add slot="card" v-model="search" @chooseList="chooseList" @getList="getList"></input-add>

    <el-button type="primary"  slot="btn" style="margin-left: 2.5px" @click="turnAdd">添加商品</el-button>
    <el-table-column slot="time" label="时间" align="center" prop="add_time">
      <template slot-scope="scope">
        {{scope.row.add_time | dateForm}}
      </template>
    </el-table-column>
    <el-table-column slot="setting" label="操作">
      <template slot-scope="scope">
       <el-button type="warning" icon="el-icon-edit" size="mini" @click="getEditGoods(scope.row)" >编辑</el-button>
       <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)">删除</el-button>
      </template>
    </el-table-column>
  </el-toast>
<!--  商品信息编辑对话框-->
  <el-dialog title="编辑商品" :visible.sync="dialogVisible">
    <el-form ref="editGoods" label-width="80px" :rules="editRules" :model="Goods">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="Goods.name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input v-model="Goods.price"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="number">
        <el-input v-model="Goods.number"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="weight">
        <el-input v-model="Goods.weight"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
   </span>
  </el-dialog>
  </div>
</template>
<script>
export default {
  name: "goodsList",
  data(){
    return {
      Goods:{
        name:'',
        price:'',
        number:'',
        weight:'',
        id:''
      },
      editRules:{
        name:[
          {required:true,message:'请输入信息',trigger:'blur'}
        ],
        price:[
          {required:true,message:'请输入价格',trigger:"blur"}
        ],
        number:[
          {required:true,message:'请输入数量',trigger:'blur'}
        ],
        weight:[
          {required:true,message:'请输入重量',trigger:"blur"}
        ]
      },
      arr:[],
      search:'',
      dialogVisible:false,
      goodsList: [],
      dataName:[
        {label:'商品名称',prop:'goods_name'},
        {label:'商品价格（元）',prop:'goods_price'},
        {label:'商品数量',prop:'goods_number'},
      ],
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5,
        pagesizes:[5,10,15],
        total:0
      }
    }
  },
  created() {
    this.getGoodsList()
    console.log(this.arr);
  },
  computed:{
    // arr(){
    //   if (this.search){
    //     return this.goodsList.filter(item => {
    //       return Object.keys(item).some(key => {
    //         return String(item[key]).match(this.search)
    //       })
    //     })
    //   }else{
    //     return this.goodsList
    //   }
    // }
  },
  methods:{
    chooseList(){
      if (this.search){
        this.arr = this.goodsList.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).match(this.search)
          })
        })
      }
    },
    getList(){
      this.getGoodsList()
    },
    async getGoodsList(){
      const {data : res} =await this.$http.get('goods',{params:this.queryInfo})
      this.goodsList = res.data.goods
      this.queryInfo.total = res.data.total
      this.arr = this.goodsList
      console.log(res);
    },
    handleSizeChange(val){
      console.log(val);
      this.getGoodsList()
    },
    handleCurrentChange(val){
      console.log(val);
      this.getGoodsList()
    },
    async deleteGoods(val){
      const confirmResult = await this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.error('删除参数失败')
      }
      const {data : res} = await this.$http.delete(`goods/${val}`)
      console.log(res);
      if (res.meta.status !== 200){
        return this.$message.error('删除商品失败')
      }
      await this.getGoodsList()
    },
    async editGoods(){
      this.dialogVisible = false
      const {data : res} = await this.$http.put(`goods/${this.Goods.id}`,{
        goods_name:this.Goods.name,
        goods_price:this.Goods.price,
        goods_number:this.Goods.number,
        goods_weight:this.Goods.weight
      })
      console.log(res);
      if (res.meta.status !== 201){
        return this.$message.error('修改商品信息失败')
      }
    },
    async getEditGoods(val){
      this.Goods.id = val.goods_id
      this.Goods.name = val.goods_name
      this.Goods.price = val.goods_price
      this.Goods.number = val.goods_number
      this.Goods.weight = val.goods_weight
      this.dialogVisible = true
      console.log(this.Goods);
    },
    turnAdd(){
      this.$router.push('/addGoods')
    }
  }
}
</script>

<style scoped>

</style>
