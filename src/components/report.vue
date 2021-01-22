<template>
  <div>
  <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 15px">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item,index) in title" :key="index">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
  <div id="main" style="width: 700px;height:400px;margin-top: 15px"></div>
  </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: "report",
  data(){
    return {
      title:['数据统计','数据报表'],
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
    this.getEcharts()
  },
  async mounted() {
    const {data : res} = await this.$http.get('reports/type/1')
    let echarts =require('echarts')
    var myChart = echarts.init(document.getElementById('main'))
    // const newOptions = _.merge(this.options,res.data)
    const newOptions = {...this.options,...res.data}
    newOptions.xAxis[0].boundaryGap = false
    myChart.setOption(newOptions)
    myChart.setOption({
      color: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      // series: [{
      //   type: 'bar',
      //   // 此系列自己的调色盘。
      //   color: ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42']
      // },
      //   {type: 'pie',
      // // 此系列自己的调色盘。
      // color: ['#37A2DA', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C','#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF'],
      // }
      //   ]
      }
    )
  },
  methods:{
    async getEcharts(){
    }
  }
}
</script>

<style scoped>

</style>
