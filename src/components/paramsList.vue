<template>
  <div>
  <el-toast :title="['商品管理','分类参数']" :data="dataList" :data-name="paramsName"
            :page-obj="pageObj">
    <el-table-column slot="setting" label="操作">
      <template slot-scope="scope">
      <el-button type="warning" @click="resetParams(scope.row.attr_id)" icon="el-icon-edit">编辑</el-button>
      <el-button type="danger" @click="deleteParams(scope.row.attr_id)" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="expand" type="expand">
    <template slot-scope="scope">
      <el-tag type="primary" v-for="(item,i) in scope.row.attr_vals"
              :key="i" closable @close="closeConfirm(scope.row,i)">{{item.length>50?item.substring(0,49) + '......':item}}</el-tag>
      <el-input
        class="input-new-tag"
        v-if="scope.row.inputVisible"
        v-model="scope.row.inputValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm(scope.row)"
        @blur="handleInputConfirm(scope.row)"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
    </template>
    </el-table-column>
    <el-alert slot="card" title="注意：只允许为第三级分类设置参数"
                type="warning" show-icon>
      </el-alert>
      <div class="block" slot="btn">
        <span class="demonstration">选择商品分类:</span>
        <el-cascader ref="selectedInput"
          style="width: 250px;margin-left: 5px"
          size="medium"
          v-model="value"
          :options="paramsList"
          :props="{ expandTrigger: 'hover' ,value:'cat_id',
          label:'cat_name',children:'children'}"
          @change="handleChange" clearable ></el-cascader>
        </div>
        <div slot="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
              <el-button type="primary" :disabled="isDisabled" @click="paramsVisible = true">添加动态参数</el-button>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="only">
              <el-button type="primary" :disabled="isDisabled" @click="paramsVisible = true">添加静态参数</el-button>
            </el-tab-pane>
          </el-tabs>
        </div>
  </el-toast>
    <el-dialog :visible.sync="dialogVisible" :title="'修改' + titleName"
                   :close-on-click-modal="false" @close="changeStatus">
          <el-form ref="addForm_first" :model="form" label-width="80px" :rules="formRules">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
          </span>
        </el-dialog>
    <el-dialog :visible.sync="paramsVisible" :close-on-click-modal="false"
               @close="changeStatus"  :title="'添加' + titleName">
      <el-form ref="addForm_Second" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="参数名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="paramsVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "paramsList",
  data() {
    return {
      formRules: {
        name: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
      paramsVisible: false,
      dialogVisible: false,
      keysLength: 0,
      value: [],
      paramsList: [],
      activeName: 'many',
      dataList: [],
      paramsName: [
        {label: '参数名称', prop: 'attr_name'}
      ],
      pageObj: {
        pagenum: 1,
        pagesize: 5,
        pagesizes: [5, 10, 15],
        total: 0
      },
      form: {
        name: '',
        attr_id: '',
        attr_vals:[]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  computed: {
    isDisabled() {
      return this.value.length === 0
    },
    titleName() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  },
  methods: {
    handleChange() {
      console.log(this.value);
      this.keysLength = this.value.length
      this.getParamsList()
      if (!this.value) {
        this.dataList = []
      }
    },
    async getGoodsList() {
      const {data: res} = await this.$http.get('categories')
      console.log(res.data);
      this.paramsList = res.data
    },
    async getParamsList() {
      if (this.value.length) {
        const {data: res} = await this.$http.get(`categories/${this.value[this.keysLength - 1]}/attributes`,
          {params: {sel: this.activeName}});
        console.log(res.data);
        if (res.meta.status !== 200) {
          return this.$message.error('参数列表获取失败')
        }
        res.data.forEach(item => {
          item.inputVisible = false;
          item.inputValue = ''
          item.attr_vals = item.attr_vals?item.attr_vals.split(" "):[]
          console.log(item.attr_vals);
        })
        this.dataList = res.data
        this.pageObj.total = this.dataList.length
      }
    },
    handleClick() {
      console.log(this.activeName);
      console.log(this.value);
      this.getParamsList()
    },
    async editParams() {
      this.$refs.addForm_first.validate(valid => {
        if (!valid) return this.$message.error('请输入参数信息')
        this.dialogVisible = false
      })
      const {data: res} = await this.$http.put(`categories/${this.value[this.value.length - 1]}/attributes/
      ${this.form.attr_id}`, {attr_name: this.form.name, attr_sel: this.activeName})
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('参数修改失败')
      }
      await this.getParamsList()
    },
    async addParams() {
      this.$refs.addForm_Second.validate(valid => {
        if (!valid) return this.$message.error('请输入参数信息')
        this.paramsVisible = false
      })
      const {data: res} = await this.$http.post(`categories/${this.value[this.value.length - 1]}/attributes`,
        {
          attr_name: this.form.name,
          attr_sel: this.activeName
        })
      console.log(res);
      if (res.meta.status !== 201) {
        return this.$message.error('参数添加失败')
      }
      await this.getParamsList()
    },
    async deleteParams(val) {
      const confirmResult = await this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.error('删除参数失败')
      }
      const {data: res} = await this.$http.delete(`categories/${this.value[this.value.length - 1]}/attributes/${val}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败')
      }
      await this.getParamsList()
    },
    changeStatus() {
      if (this.$refs.addForm_first !== undefined) {
        this.$refs.addForm_first.resetFields()
      }
      if (this.$refs.addForm_Second !== undefined) {
        this.$refs.addForm_Second.resetFields()
      }
    },
    resetParams(val) {
      this.dialogVisible = true
      this.form.attr_id = val
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false;
        row.inputValue = '';
        console.log(row.inputVisible);
      }else {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = '';
        row.inputVisible = false
        const {data : res} = await this.$http.put(`categories/${this.value[this.value.length - 1]}/attributes/${row.attr_id}`,
          {
            attr_name:row.attr_name,
            attr_sel: this.activeName,
            attr_vals:row.attr_vals.join(' ')
          })
        console.log(res);
        if (res.meta.status !== 200){
          return this.$message.error('参数添加失败')
        }
      this.$message.success('参数添加成功')
      }
    },
    async closeConfirm(row,i){
      const confirmResult = await this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.error('删除参数失败')
      }
      row.attr_vals.splice(i,1)
      const {data : res} = await this.$http.put(`categories/${this.value[this.value.length - 1]}/attributes/${row.attr_id}`,
        {
          attr_name:row.attr_name,
          attr_sel: this.activeName,
          attr_vals:row.attr_vals.join(' ')
        })
      console.log(res);
      console.log(typeof row.attr_vals);
    }
  },
    watch: {
      value() {
        if (this.value.length === 0) {
          this.dataList = []
        }
      },
      dialogVisible() {
        if (this.$refs.addForm_first !== undefined) {
          this.$refs.addForm_first.resetFields()
        }
      }
    },
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 15px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.el-tag{
  margin-bottom: 10px;
  margin-left: 0 !important;
  margin-right: 10px;
}
</style>
