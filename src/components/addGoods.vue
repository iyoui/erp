<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
    <el-card>
      <el-alert type="info" show-icon center>添加商品信息</el-alert>
      <el-steps :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
<!--      标签页-->
      <el-form ref="addGoods" :rules="addGoodsRules" :model="addGoods">
      <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforeLeave"
               @tab-click="getManyCategories">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item :label="item.label" :prop="item.prop" v-for="(item,index) in dataName" :key="index">
            <el-input v-model="addGoods[item['prop']]"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="categories">
            <br>
            <el-cascader  v-model="addGoods.categories" :options="options"
                          :props="{ expandTrigger: 'hover', value:'cat_id',label:'cat_name',children:'children' }"
                          @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="(item , index) in manyData" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <br>
              <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border style="margin-right: 15px"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item.attr_name" v-for="(item ,index) in onlyData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-form-item label="商品图片">
            <!--              action上传图片时请求的API地址-->
            <br>
            <el-upload
              class="upload-demo" :headers="headers" :on-success="successPics"
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-dialog :visible.sync="previewVisible" width="50%" title="图片预览">
            <img :src='previewPath' style="width: 100%">
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <el-form-item label="商品内容">
            <br>
          <quill-editor v-model="addGoods.introduce"></quill-editor>
          </el-form-item>
          <el-button type="primary" @click="addNewGoods">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "addGoods",
  data(){
    return {
      options:[],
      activeIndex:'0',
      tabPosition:'left',
      addGoodsRules:{
        name:[
          {required:true,message:"请输入信息",trigger:"blur"}
        ],
        price:[
          {required:true,message:"请输入信息",trigger:"blur"}
        ],
        number:[
          {required:true,message:"请输入信息",trigger:"blur"}
        ],
        weight:[
          {required:true,message:"请输入信息",trigger:"blur"}
        ],
        categories: [
          {type:'array',required:true,message:'请选择商品分类',trigger:"blur"}
        ]
      },
      addGoods:{
        name:'',
        price:'',
        number:'',
        weight:'',
        categories:[],
        pics:[],
        introduce:'',
        attrs:[]
      },
      dataName:[
        {label:'商品名称',prop:'name'},
        {label:'商品价格',prop:'price'},
        {label:'商品数量',prop:'number'},
        {label:'商品重量',prop:'weight'},
      ],
      manyData:[],
      onlyData:[],
      headers:{
        Authorization:window.sessionStorage.getItem('token')
      },
      previewVisible:false,
      previewPath:''
    }
  },
  created() {
    this.getCategories();
  },
  methods:{
    handleChange(){

    },
    async getCategories(){
      const {data : res} = await this.$http.get('categories')
      if (res.meta.status !== 200){
        this.$message.error('参数列表获取失败')
      }
      this.options = res.data
    },
    beforeLeave(activeName,oldActiveName){
      if (oldActiveName === '0' && this.addGoods.categories.length !== 3){
        this.$message.error('请选择商品信息')
        return false
      }
    },
    async getManyCategories(){
      if (this.activeIndex === '1') {
        const {data: res} = await this.$http.get(`categories/${this.addGoods.categories[2]}/attributes`,
          {params:{sel:'many'}})
        this.manyData = res.data
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
      }
      if (this.activeIndex === '2'){
        await this.getOnlyData()
      }
      if (this.activeIndex === '3'){

      }
    },
    async getOnlyData(){
      const {data :res} = await this.$http.get(`categories/${this.addGoods.categories[2]}/attributes`,
        {params:{sel:'only'}})
      this.onlyData = res.data
    },
    //处理移除图片
    handleRemove(file) {
      const filePath = this.addGoods.pics.findIndex(item => {
        return item === file.response.data.tmp_path
      })
      this.addGoods.pics.splice(filePath,1)
    },
    //图片预览效果
    handlePreview(file) {
      this.previewVisible = true
      this.previewPath = file.response.data.url
    },
    successPics(response){
      this.addGoods.pics.push(response.data.tmp_path)
    },
    addNewGoods(){
      // var form = this.deepClone(this.addGoods)
      this.$refs.addGoods.validate(async (valid,obj) => {
        var form = JSON.parse(JSON.stringify(this.addGoods))
        form.categories = this.addGoods.categories.join(',')
        console.log(this.addGoods);
        if (!valid){
          for (let key in obj) {
            var timer = null;
              timer = setTimeout(() => {
                //让弹出框分别弹出
                return this.$message.error('请填写' + obj[key][0].field)
              }, 100)
            }
          }
        this.onlyData.forEach(item => {
          const newOnlyInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
          this.addGoods.attrs.push(newOnlyInfo)
        });
        this.manyData.forEach(item => {
          const newManyInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
          this.addGoods.attrs.push(newManyInfo)
        })
        form.attrs = this.addGoods.attrs
        console.log(form);
        const {data : res} = await this.$http.post('goods',{
          goods_name:form.name,
          goods_cat:form.categories,
          goods_price:form.price,
          goods_number:form.number,
          goods_weight:form.weight,
          goods_introduce:form.introduce,
          pics:form.pics,
          attrs:form.attrs
        })
        console.log(res);
        if (res.meta.status !== 201){
          return this.$message.error('创建商品失败')
        }
        this.$message.success('创建商品成功')
        await this.$router.push('/goods')
      })
    },
    deepClone(source){
      var target = {}
      for (let key in source){
        if (source.hasOwnProperty(key)){
          if (typeof source === 'object'){
            target[key] = this.deepClone(source[key])
          }else{
            target[key] = source[key]
          }
          return target
        }
      }
    }
  }
}
</script>

<style scoped>
.el-card{
  margin-top: 15px;
}
.el-steps{
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
