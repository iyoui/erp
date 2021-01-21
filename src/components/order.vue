<template>
  <div>
  <el-toast :title="['订单管理','订单列表']" :page-obj="pageObj" :data="arr"
            :data-name="dataName" @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange">
    <input-add slot="card" v-model="search" @chooseList="chooseList"
               @getList="getList"></input-add>
    <el-table-column slot="status" label="是否付款" align="center">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.pay_status === 0" type="primary">已付款</el-tag>
        <el-tag v-else type="danger">未付款</el-tag>
      </template>
    </el-table-column>
    <el-table-column slot="send" label="是否发货" align="center">
      <template slot-scope="scope">
        {{scope.row.is_send}}
      </template>
    </el-table-column>
    <el-table-column slot="time" label="创建时间" align="center">
      <template slot-scope="scope">
        {{scope.row.create_time | dateForm}}
      </template>
    </el-table-column>
    <el-table-column slot="setting" label="操作">
      <el-button type="primary" icon="el-icon-edit" size="mini" @click="orderVisible = true"></el-button>
      <el-button type="success" icon="el-icon-location" size="mini" @click="progressEdit"></el-button>
    </el-table-column>
  </el-toast>
  <el-dialog :visible.sync="orderVisible" title="修改地址" width="50%">
    <el-form ref="addOrder" :rules="addOrderRules" :model="editOrder" label-width="100px">
      <el-form-item label="省市区/县" prop="address1">
        <el-cascader :options="options" v-model="editOrder.address1" style="width: 100%"
                     :props="{ expandTrigger: 'hover', value:'value',label:'label',children:'children' }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address2">
        <el-input v-model="editOrder.address2"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
       <el-button @click="orderVisible = false">取 消</el-button>
       <el-button type="primary" @click="addOrder">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog title="物流信息" :visible.sync="progressVisible">
    <el-timeline :reverse="false">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.timestamp">
        {{activity.content}}
      </el-timeline-item>
    </el-timeline>
    <span slot="footer" class="dialog-footer">
       <el-button @click="progressVisible = false">取 消</el-button>
       <el-button type="primary" @click="progressVisible = false">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import {regionData}  from 'element-china-area-data'
export default {
  name: "order",
  data(){
    return {
      search:"",
      orderVisible:false,
      pageObj:{
        query:'',
        pagenum:1,
        pagesize:5,
        pagesizes:[5,10,15],
        total:0
      },
      orderList:[],
      dataName:[
        {label:'订单编号',prop:'order_number'},
        {label:'订单价格',prop:'order_price'},
      ],
      arr:[],
      editOrder:{
        address1:[],
        address2:''
      },
      addOrderRules:{
        address1: [
          {required:true,message:'请输入信息',trigger:"blur"}
        ],
        address2: [
          {required:true,message:'请输入信息',trigger:"blur"}
        ]
      },
      options:regionData,
      progressVisible:false,
      activities:[]
    }
  },
  created() {
    this.getOrderList()
  },
  methods:{
    addOrder(){

    },
    chooseList(){
      if (this.search) {
       this.arr = this.orderList.filter(item => {
          return Object.keys(item).some(key => {
            return String(item[key]).match(this.search)
          })
        })
      }
      this.pageObj.total = this.arr.length
    },
    getList(){
      this.getOrderList()
    },
    async getOrderList(){
      const {data : res} = await this.$http.get('orders',{params:this.pageObj})
      console.log(res);
      if (res.meta.status !== 200){
        return this.$message.error('获取列表失败')
      }
      this.orderList = res.data.goods
      this.arr = this.orderList
      this.pageObj.total = res.data.total
    },
    handleCurrentChange(){
      this.getOrderList()
    },
    handleSizeChange(){
      this.getOrderList()
    },
    async progressEdit(){
      this.progressVisible = true;
      this.activities = [
        {timestamp:'2021-1-21',content:'快递已签收'},
        {timestamp:'2021-1-20',content:'快递已达到浙江省'},
        {timestamp:'2021-1-20',content:'快递已发出'},
      ]
    }
  },
  watch:{
    orderVisible(){
      this.$refs.addOrder.resetFields()
    }
  }
}
</script>

<style scoped>

</style>
