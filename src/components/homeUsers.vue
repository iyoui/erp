<template>
  <div>
<!--    table表格组件-->
    <el-toast :title="['用户管理','用户列表']" :data="usersList" :data-name="dataName" :page-obj="queryInfo"
              @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"
              @changeState="changeState(queryInfo)" @change="changeState">
      <el-row slot="card" :gutter="5">
<!--        输入下拉框-->
        <input-add v-model="search" @chooseList="chooseUsersList" @getList="getUserList"></input-add>
<!--        添加用户按钮-->
        <el-button type="primary"  @click="dialogVisible = true">添加用户</el-button>
<!--        添加用户弹出框组件-->
        <form-check :dialog-visible.sync="dialogVisible" @addUser="addUser" :form="addForm"></form-check>
      </el-row>
<!--      操作按钮-->
      <setting-btn slot="setting" label="设置" :size="size" :type-arr="typeArr" content="角色设置"
                    @changeBtn="changeBtn"></setting-btn>
    <el-dialog slot="dialog"
      title="角色设置"
      :visible.sync="roleVisible"
      width="30%" @close="roleListId = ''">
      <p>当前的用户：{{userInfo.username}}</p>
      <p>当前的角色：{{userInfo.role_name}}</p>
      <p>分配角色：
        <el-select v-model="roleListId" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="roleVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoles">确 定</el-button>
  </span>
    </el-dialog>
    </el-toast>
  </div>
</template>

<script>
export default {
  name: "homeUsers",
  data(){
    return {
      typeArr:[
        {type:'primary',icon:'el-icon-edit'},
        {type:'danger',icon:'el-icon-delete'},
        {type:'warning',icon:'el-icon-setting'}
      ],
      size:"mini",
      search:'',
      queryInfo:{
        query:'',
        //当前页数
        pagenum:1,
        //当前每页显示多少条
        pagesize:5,
        pagesizes:[5,10,15],
        total:0
      },
      usersList:[],
      queryList:[],
      dataName:[
        {prop:"role_name",label:"角色"},
        {prop:"username",label:"账号"},
        {prop:"mobile",label:"电话"},
        {prop:"email",label:"邮箱"},
        {prop:"mg_state",label:"状态"}
      ],
      dialogVisible:false,
      editForm:false,
      // editFormRules:{
      //   username:[
      //     {required:true,message:'请输入用户名',trigger:'blur'},
      //     {min:3,max:10,message:'请用户名的长度在 3-10位',trigger:'blur'}],
      //   email:[
      //     {required:true,message:'请输入邮箱',trigger:'blur'},
      //     {validator:checkEmail,trigger: 'blur'}],
      //   mobile:[
      //     {required:true,message:'请输入手机',trigger:'blur'},
      //     {validator:checkMoblie,trigger:'blur'}]
      // },
      roleVisible:false,
      userInfo:{},
      roleList:[],
      roleListId:'',
      addForm: {}
    }
  },
  created() {
    this.getUserList()
    this.chooseQueryList()
  },
  computed:{
    // console.log(1)
    //绑定:data为arr时生效
    // arr() {
    //   if (this.search) {
    //     return this.usersList.filter(item => {
    //       return Object.keys(item).some(key => {
    //         return String(item[key]).match(this.search)
    //       })
    //     })
    //   }else {
    //     return this.usersList
    //   }
    // }
  },
  methods: {
    changeBtn(item,msg){
      if (item.type === 'warning'){
        this.toRight(msg)
        // console.log(item);
      }
      if (item.type === 'danger'){
        this.deleteMsg(msg.id)
      }
      if (item.type === 'primary'){
        this.dialogVisible = true
        this.editFormShow(msg)
      }
    },
    async getUserList() {
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      console.log(res);
      this.usersList = res.data.users
      this.queryInfo.total = res.data.total
    },
    async chooseQueryList() {
      var queryInfo_1 = Object.assign({}, this.queryInfo)
      queryInfo_1.pagenum = 1
      queryInfo_1.pagesize = 100
      queryInfo_1.query = ''
      const {data: res} = await this.$http.get('users', {params: queryInfo_1})
      // console.log(res);
      this.queryList = res.data.users
      // console.log(this.queryList);
      // this.total = res.length
    },
    chooseUsersList() {
      // if (this.search){
      // }
      // return this.queryList
      // this.usersList = this.queryList
      if (this.search) {
        this.usersList = this.queryList.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).match(this.search)
          })
        })
      }
    },
    //监听每页显示条数改变
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    //监听页码值改变
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    async changeState(state) {
      // console.log(state);
      // console.log(state.id);
      // console.log(state.mg_state);
      const {data: res} = await this.$http.put(`users/${state.id}/state/${state.mg_state}`)
      if (res.meta.status !== 200) {
        state.mg_state = !state.mg_state
        return this.$msg.error('更新失败')
      }
      // this.$msg.success('更新成功')
    },
    addUser() {
      // console.log(this.addForm);
      this.$http.post('users',this.addForm)
      this.getUserList()
    },
    // editUser(){
    //   this.$refs.editFormRef.validate(async valid => {
    //     if (!valid)return
    //     const {data: res} = await this.$http.put('users/' + this.addForm.id,{
    //       email:this.addForm.email,
    //       mobile:this.addForm.mobile
    //     })
    //     if (res.meta.status !== 200){
    //       this.$msg.error('修改失败')
    //     }
    //     this.$msg.success('修改成功')
    //   })
    //   this.editForm = false
    //   this.getUserList()
    // },
    editFormShow(val){
      this.editForm = true
      // console.log(val.id);
      this.addForm = val
    },
    deleteMsg(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.$http.delete('users/' + id)
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '删除失败'
        })
      })
    },
    async toRight(userInfo){
      // await this.$router.push('/rights')
      this.roleVisible = true
      this.userInfo = userInfo
      console.log(this.userInfo);
      const {data : res } =await this.$http.get('roles')
      console.log(res);
      this.roleList = res.data
      // this.roleListId = res.data.roleName
      // console.log(this.roleList);
    },
    indexMethods(index) {
      return (this.queryInfo.pagenum - 1) * this.queryInfo.pagesize + index + 1
    },
    async setRoles(){
      if (!this.roleListId) {
        return this.$message.error('没有选择角色')
      }
      // console.log(this.userInfo);
      this.roleVisible = false
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.roleListId})
    // axios({
    //   url:'http://timemeetyou.com:8889/api/private/v1/user/${this.userInfo.id}/role',
    //   method:'get',
    //   rid:this.roleListId
    // }).then( res => {
    //   console.log(res);
    // })
    console.log(res);
    // console.log(${this.userInfo.id});
    if (res.meta.status !== 200) {
      return this.$message.error('分配角色失败')
    }
    this.$message.success('分配角色成功')
    await this.getUserList()
    },
  }
}
</script>

<style scoped>
.el-dialog p{
  padding: 10px;
}
.el-row{
  margin-bottom: 15px;
}
</style>
