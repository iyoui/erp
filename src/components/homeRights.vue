<template>
  <div>
<!--    <el-card>-->
<!--      <el-table :data="list" border>-->
<!--        <el-table-column type="index" label="" :index="index">-->
<!--&lt;!&ndash;          <template slot-scope="scope">&ndash;&gt;-->
<!--&lt;!&ndash;            {{scope.$index + (queryInfo.pagenum-1)*queryInfo.pagesize + 1}}&ndash;&gt;-->
<!--&lt;!&ndash;          </template>&ndash;&gt;-->
<!--        </el-table-column>-->
<!--      </el-table>-->
<!--    </el-card>-->
    <el-toast :title="['权限管理','权限列表']" :data="list" :data-name="dataName" :page-obj="queryInfo">
              <el-table-column label="权限等级" prop="level" slot="setting" align="left">
                <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.level === '0'">等级一</el-tag>
                <el-tag type="warning" v-if="scope.row.level === '1'">等级二</el-tag>
                <el-tag type="danger" v-if="scope.row.level === '2'">等级三</el-tag>
                </template>
              </el-table-column>
    </el-toast>
  </div>
</template>

<script>
export default {
  name: "homeRights",
  data(){
    return {
      listData:[],
      list:[],
      queryInfo:{
        pagenum:1,
        pagesize:5,
        pagesizes:[5,10,15],
        total:0
      },
      dataName:[
        {label:'权限名称',prop:'authName'},
        {label:'权限路径',prop:'path'}
      ]
    }
  },
  created() {
    this.getRightsList()
  },
  computed:{
  },
  methods:{
     async getRightsList(){
      const {data: res} = await this.$http.get('rights/list')
       console.log(res);
      if (res.meta.status !== 200){
        return this.$msg.error('获取失败')
      }
      this.list = res.data
      // this.list = res.data.slice((this.queryInfo.pagenum-1)*this.queryInfo.pagesize,(this.queryInfo.pagenum-1)*this.queryInfo.pagesize+this.queryInfo.pagesize)
      this.queryInfo.total = res.data.length
     },
    handleSizeChange(val){
      console.log(val);
      this.queryInfo.pagesize = val
      this.getRightsList()
    },
    handleCurrentChange(val){
      console.log(val);
      this.queryInfo.pagenum = val
      this.getRightsList()
      // if (val === 1){
        // console.log(this.list);
      // }
    },
    indexMethods(index){
        return (this.queryInfo.pagenum-1)*this.queryInfo.pagesize + index +1
    }
  }
}
</script>

<style scoped>
.el-card{
  margin-top: 15px;
}
</style>
