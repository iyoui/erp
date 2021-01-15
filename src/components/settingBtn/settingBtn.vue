<template>
  <el-table-column width="182px" align="center" slot="setting" v-bind="$attrs">
    <template slot-scope="scope">
      <el-button v-for="(item,index) in typeArr" :size="size" :type="item.type"
                 :key="index" :icon="item.icon" v-if="item.type !== 'warning'"
                  @click="changeBtn(item,scope.row)">
      </el-button>
<!--      <el-button type="primary" icon="el-icon-edit" size="mini" @click="editFormShow(scope.row)"></el-button>-->
<!--      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMsg(scope.row.id)"></el-button>-->
<!--      <el-tooltip effect="dark" content="角色设置" placement="top-end" :enterable="false">-->
<!--        <el-button type="warning" icon="el-icon-setting" size="mini" @click="toRight(scope.row)"></el-button>-->
<!--      </el-tooltip>-->
      <el-tooltip v-else effect="dark" placement="top-end" :enterable="false" v-bind="$attrs">
        <el-button v-for="(item,index) in typeArr" :size="size" :type="item.type"
                   :key="index" :icon="item.icon" @click="changeBtn(item,scope.row)"></el-button>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: "settingBtn",
  props:{
    labelName:{
      type:String,
      default:''
    },
    typeArr:{
      type: Array,
      default:() => {
        return [
          // {type:'primary',icon:'el-icon-edit'},
          // {type:'danger',icon:'el-icon-delete'},
          // {type:'warning',icon:'el-icon-setting'}
        ]
      }
    },
    size:{
      type:String,
      default:""
    }
  },
  created() {
    console.log(this.labelName);
  },
  methods:{
    changeBtn(item,msg){
      this.$emit('changeBtn',item,msg)
    }
  }
}
</script>

<style scoped>

</style>
