<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in title" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="el-card">
      <div class="first_btn"><slot name="first_btn"></slot></div>
      <div class="slot_card"><slot name="card"></slot></div>
      <div class="btn"><slot name="btn"></slot></div>
      <div class="tabs"><slot name="tabs"></slot></div>
      <div class="addBtn"><slot name="addBtn"></slot></div>
      <el-table :data="data.length === pageObj.total?
      data.slice((pageObj.pagenum-1)*pageObj.pagesize,pageObj.pagesize*pageObj.pagenum):data"
                border stripe :header-cell-style="{'text-align':'center'}" v-if="isDisplay">
        <slot name="otherTable"></slot>
<!--          <el-table-column type="expand" isShow="isExpand">-->
            <slot name="expand"></slot>
<!--          </el-table-column>-->
          <el-table-column :label="labelName" :width="50" align="center">
            <template slot-scope="scope">
              <span v-if="pageObj.pagenum" >{{scope.$index + 1 + (pageObj.pagenum-1)*pageObj.pagesize}}</span>
              <span v-else>{{scope.$index + 1 }}</span>
            </template>
          </el-table-column>
        <template v-for="(item,index) in dataName">
          <el-table-column v-if="item.prop !=='mg_state'" :label="item.label" :prop="item.prop" align="center"></el-table-column>
          <el-table-column v-else :label="item.label" :prop="item.prop" width="100%" align="center">
            <template slot-scope="scope">
                 <el-switch v-model="scope.row.mg_state" active-color="#13ce66" @change="change(scope.row)">
                 </el-switch>
            </template>
          </el-table-column>
        </template>
        <slot name="setting"></slot>
      </el-table>
      <div class="block">
        <el-pagination v-if="pageObj.pagenum" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="pageObj.pagenum"
                       :page-sizes="pageObj.pagesizes"
                       :page-size="pageObj.pagesize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pageObj.total">
        </el-pagination>
      </div>
    </el-card>
    <slot name="dialog"></slot>
  </div>
</template>

<script>
export default {
  name: "elToast",
  props:{
    isDisplay:{
      type:Boolean,
      default:true
    },
    isExpand:{
      type:Boolean,
      default:false
    },
    title:{
      type:Array,
      default:() => {}
    },
    type:{
      type:String,
      default: ''
    },
    data:{
      type:Array,
      default: () => {
        return [
        ]
      }
    },
    dataName:{
      type:Array,
      default:() => {
        return [
        ]
      }
    },
    dataString:{
      type:Array,
      default:() => {}
    },
    //当前页码
    pageObj:{
      type:Object,
      default:() => {
        return {
          pagenum:'',
          pagesize:''
        }
      }
    },
    isShow:{
      type:Boolean,
      default:false
    },
    indexShow:{
      type:Boolean,
      default:true
    },
    labelName:null
  },
  data(){
    return {
      // pagenum:this.pagenum1
    }
  },
  computed:{
    // pagenum:function (){
    //   return this.pagenum1.trim().toLowerCase()
    // }
  },
  methods:{
    handleSizeChange(val){
      this.pageObj.pagesize = val
      this.pageObj.pagenum = 1
      this.$emit('handleSizeChange',this.pageObj.pagesize,this.pageObj.pagenum)
    },
    handleCurrentChange(val){
      this.$emit('handleCurrentChange',this.pageObj.pagenum)
    },
    change(state){
      console.log(state);
      this.$emit('change',state)
    }
  },
  watch:{

  }
}
</script>

<style scoped>
.el-card{
  margin-top: 15px;
}
.btn{
  margin-bottom: 15px;
}
.cell{
  text-align: center;
}
.block{
  margin-top: 15px;
}
.slot_card{
  margin-bottom: 15px;
}
.tabs{
  margin-bottom: 15px;
}
.addBtn{
  margin-bottom: 15px;
}
.btn{
  margin-bottom: 15px;
}
.first_btn{
  margin-bottom: 15px;
}
</style>
