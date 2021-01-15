<template>
  <div>
    <el-toast :title="['权限管理','角色列表']" :data="roleList" :data-name="dataName">
              <el-table-column type="expand" slot="otherTable">
                <template slot-scope="scope">
                  <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['bdRow',index1 === 0?'tpRow':'','vertical','vertical']" >
                    <el-col :span="6">
                    <el-tag closable  @close="handleClose(scope.row,item1)">{{item1.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2 === 0?'':'tpRow','vertical']">
                        <el-col :span="6">
                          <el-tag type="success" closable @close="handleClose(item1,item2)">{{item2.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="18">
                          <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" closable
                                  @close="handleClose(item2,item3,scope.row)">{{item3.authName}}</el-tag>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
<!--                  <pre>{{scope.row}}</pre>-->
                </template>
              </el-table-column>
              <el-table-column label="操作" width="300px" slot="setting">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-edit" @click="dialogVisible = true">编辑</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleClose">删除</el-button>
                  <el-button size="mini" type="warning" icon="el-icon-setting" @click="showRightTree(scope.row)">分配权限</el-button>
                  <el-dialog
                    title="分配权限"
                    :visible.sync="dialogVisible"
                    width="30%" @close="resetDialog">
                    <el-tree :data="rightList" :props="defaultProps" show-checkbox node-key="id"
                             :default-checked-keys="defaultKeys" ref="rolesTree">
                    </el-tree>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="resetRoles(scope.row)">确 定</el-button>
                    </span>
                  </el-dialog>
                </template>
              </el-table-column>
    </el-toast>
  </div>
</template>

<script>
export default {
  name: "homeList",
  data(){
    return {
      roleList:[],
      dialogVisible:false,
      defaultProps:{
        children:"children",
        label:'authName'
      },
      dataName:[
        {prop:'roleName',label: '角色名称'},
        {prop:'roleDesc',label: '角色描述'}
      ],
      rightList:[],
      defaultKeys:[],
      showKey:[],
      roleId:0
    }
  },
  created() {
    this.getRoleLists()
  },
  methods:{
    async getRoleLists(){
      const {data : res} =await this.$http.get('roles')
      // console.log(res);
      if (res.meta.status !== 200){
        return this.$message.error('列表信息获取失败')
      }
      this.roleList = res.data
      console.log(this.roleList);
    },
    async handleClose(dynamicTags,tag,val) {
     const confirmResult =await this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult);
     if (confirmResult !== 'confirm'){
       return this.$message.error('删除权限失败')
     }
      const {data :res } = await this.$http.delete(`roles/${val.id}/rights/${tag.id}`)
      console.log(res);
      if (res.meta.status !== 200){
        return this.$message.error('删除权限失败')
      }
      //如果没有此条语句，在删除后需要重新获取roleList才能更新视图，但是这个方法会将整个视图重新渲染
      //可以将dynamicTags.children = res.data 进行重新赋值
      //dynamicTags是引用类型数据
      // ，指向data，变成了响应式
      dynamicTags.children.splice(dynamicTags.children.indexOf(tag), 1)
      return this.$message.success('删除权限成功')
    },
    async showRightTree(node){
      const {data : res} =await this.$http.get('rights/tree')
      console.log(res);
      this.roleId = node.id - 0
      // console.log(typeof this.roleId);
      this.rightList = res.data
      this.getNode(node,this.defaultKeys)
      // console.log(node);
      this.dialogVisible = true
    },
    getNode(node,arr){
      if (!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getNode(item,arr)
      })
    },
    resetDialog(){
      this.defaultKeys = []
    },
    async resetRoles(role){
      // this.roleId = role.id + ''
      this.dialogVisible = false
      const keys = [...this.$refs.rolesTree.getCheckedKeys(),
        ...this.$refs.rolesTree.getHalfCheckedKeys()]
      console.log(keys);
      const idStr = keys.join(',')
      console.log(idStr);
      const {data : res } = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      console.log(res);
      if (res.meta.status !== 200){
        return this.$message.error('刷新列表失败')
      }
      this.$message.success('刷新列表成功')
      console.log(this.roleId);
      await this.getRoleLists()
    }
  }
}
</script>

<style scoped>
.box{
  margin-top: 15px;
}
.el-tag{
  margin: 10px;
}
.bdRow{
  border-bottom: solid 1px lightblue;
}
.tpRow{
  border-top: solid 1px lightblue;
}
.vertical{
  display: flex;
  align-items: center;
}
</style>
