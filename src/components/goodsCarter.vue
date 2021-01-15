<template>
  <div>
    <el-toast :title="title" :is-display="false" class="el-toast" :page-obj="pageObj">
      <el-button type="primary" slot="first_btn" @click="getCartList">添加分类</el-button>
      <ZkTable :data="cartListSlice" slot="card" :tree-type="true" :columns="dataName" :selection-type="false"
                :expand-type="false" index-text="序号" show-index border>
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="'scope.row.cat_deleted' === true" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: lightblue"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="danger">二级</el-tag>
          <el-tag v-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
        </template>
        <template slot="setting" slot-scope="scope">
          <el-button size="mini" type="warning" @click="editGoods(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteGoods(scope.row)">删除</el-button>
        </template>
      </ZkTable>
    </el-toast>
    <el-dialog title="添加分类" :visible.sync="shopVisible" width="50%" :close-on-click-modal="false"
                @close="closeDialog">
      <el-form ref="addForm" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            style="width: 100%"
            v-model="selectedKeys"
            :options="getGoodsList"
            :props="{options,checkStrictly: true,expandTrigger:'hover',
            value:'cat_id',label:'cat_name',children: 'children'}" :clearable="true"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                      <el-button @click="shopVisible = false">取 消</el-button>
                      <el-button type="primary" @click="addCartList">确 定</el-button>
                    </span>
    </el-dialog>
    <el-dialog title="修改分类" :visible.sync="changeVisible" width="50%" :close-on-click-modal="false"
               @close="closeDialog">
      <el-form ref="addForm_first" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                      <el-button @click="changeVisible = false">取 消</el-button>
                      <el-button type="primary" @click="changeForm">确 定</el-button>
                    </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "goods-carter",
  components:{
    // elToast
  },
  computed:{
    cartListSlice(){
      return this.cartList.slice(
        (this.pageObj.pagenum-1)*this.pageObj.pagesize,this.pageObj.pagesize*this.pageObj.pagenum
      )
    }
  },
  data(){
    return {
      changeVisible:false,
      form:{
        cat_name:'',
        cat_level:0,
        cat_pid:0,
        cat_id:0
      },
      selectedKeys:['1','2','3'],
      getGoodsList:[],
      options:{value:'cat_id',label:'cat_name',children:'children'},
      formRules:{
        cat_name:[{required:true,message:'请输入名称',trigger:'blur'}]
      },
      shopVisible:false,
      dataName:[
        {label:'商品分类',prop:'cat_name'},
        {label:'是否有效',prop:'cat_deleted',type:'template',template:'isOk'},
        {label:'分类等级',prop:'cat_level',type:'template',template: 'order'},
        {label:'设置',type:'template',template: 'setting'}
      ],
      title:['商品管理','商品分类'],
      cartList:[],
      pageObj:{
        pagenum:1,
        pagesize:5,
        pagesizes:[5,10,15],
        total:0
      },
      labelName:'序号',
      addCart:[]
    }
  },
  created() {
    this.getGoods()
  },
  methods:{
    async getGoods(){
      const {data : res} =await this.$http.get('categories')
      console.log(res.data);
      this.cartList = res.data
      this.pageObj.total = this.cartList.length
    },
    handleCurrentChange(val){
      this.pageObj.pagenum = val
      console.log(val)
    },
    handleSizeChange(val){
      // this.pageObj.pagesize = val
      // this.cartList.slice(0,9)
      console.log(val);
    },
    handleChange(val){
      if (val.length>0) {
        this.form.cat_pid = this.selectedKeys[val.length-1]
        this.form.cat_level = val.length
        console.log(this.form);
      }else{
        this.addCart.cat_pid = 0
        this.addCart.cat_level = 0
      }
    },
    async getParentCartList(){
      const { data:res } = await this.$http.get('categories',{params:{type:2}})
      this.getGoodsList = res.data
    },
    getCartList(){
      this.getParentCartList();
      this.shopVisible = true
    },
     addCartList(){
      this.$refs.addForm_first.validate(async valid => {
        if (!valid)return this.$message.error('字段不能为空')
        const {data:res} =await this.$http.post('categories',this.form)
        this.$message.success('添加分类成功')
        this.shopVisible = false
        if (res.meta.status !== 200){
          return this.$message.error('更新失败')
        }
        this.$message.success('更新成功')
      });

    },
    async deleteGoods(val){
      const confirmResult =await this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm'){
        return this.$message.error('删除权限失败')
      }
      await this.$http.delete(`categories/${val.cat_id}`)
      await this.getGoods()
    },
    async editGoods(val){
      // this.$set(this.form,"cat_name",val.cat_name);
      console.log(this.form);
      this.form.cat_name = val.cat_name
      this.form.cat_id = val.cat_id
      await this.getParentCartList()
      this.changeVisible = true
    },
    closeDialog(){
        //如果不设置为0，则打开下一个对话框仍为第一次查询到的数据?存疑
      if (this.$refs.addForm !== undefined) {
        this.$refs.addForm.resetFields();
      }
      if (this.$refs.addForm_first !== undefined) {
        this.$refs.addForm_first.resetFields();
      }
        // this.form.cat_name =''
        // this.form.cat_level = 0;
        // this.form.cat_pid = 0
    },
    async changeForm(){
      const {data:res} = await this.$http.put(`categories/${this.form.cat_id}`,{cat_name:this.form.cat_name})
      console.log(res);
      this.changeVisible = false
    }
  },
  watch:{
    shopVisible(newVal,oldVal){
      // if (this.shopVisible === false){
        this.selectedKeys = []
      //   this.form.cat_name = undefined
      // }
    }

  }
}
</script>

<style scoped>
.btn{
  /*margin-bottom: 15px;*/
}
.el-card{
  margin: 15px;
}
</style>
