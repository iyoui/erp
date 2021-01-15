<template>
  <div>
    <el-col :span="8">
      <el-input v-bind="$attrs" v-on="$listeners"
                placeholder="请输入内容"
                clearable @clear="getList"
                @keyup.enter.native="chooseList">
        <el-button slot="append" icon="el-icon-search" @click="chooseList"></el-button>
      </el-input>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "inputAdd",
  model:{
    // prop:'content',
    // event:'change'
  },
  methods:{
    getList(){
      this.$emit('getList')
    },
    chooseList(){
      this.$emit('chooseList')
    },
  },
  // watch:{
  //   content(newVal,oldVal){
  //     if (newVal !== oldVal){
  //       console.log(newVal);
  //       this.content = newVal
  //     }
  //   },
  //   value(newVal,oldVal){
  //     if (newVal !== oldVal){
  //       console.log(newVal);
  //       this.$emit('input',newVal)
  //     }
  //   }
  // }
}
</script>

<style scoped>

</style>
