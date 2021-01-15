<template>
  <div>
    <el-dialog title="添加用户" :visible.sync="visible" width="50%"
                :close-on-click-modal="false" @close="$emit('update:dialogVisible',false)">
      <el-form ref="addFormRef" label-width="80px" :model="form" :rules="addFormRules">
        <el-form-item :label="item.label" :prop="item.prop" v-for="(item,index) in addForm" :key="index">
          <el-input v-model="form[item.prop]" v-if="item.prop === 'password'" :type="pswType">
              <i slot="suffix" :class="pswType === 'password'?icon[0]:icon[1]"
                 @click="pswType === 'password'?pswType='text':pswType='password'"></i>
          </el-input>
          <el-input v-model="form[item.prop]" v-else></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button @click="$emit('update:dialogVisible',false)">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "formCheck",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: () => {

      }
    },
    addForm: {
      type: Array,
      default: () => {
        return [
          {label: '用户名', prop: 'username'},
          {label: '密码', prop: 'password'},
          {label: '邮箱', prop: 'email'},
          {label: '手机', prop: 'mobile'}
        ]
      }
    }
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      const RegEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (RegEmail.test(value)) {
        return callback()
      }
      callback(new Error('错误的邮箱'))
    };
    var checkMoblie = (rule, value, callback) => {
      const RegMobile = /^1[34578]\d{9}$/
      if (RegMobile.test(value)) {
        return callback()
      }
      callback(new Error('错误的手机'))
    }
    return {
      visible: false,
      icon: ['el-input__icon el-icon-view',
        'el-input__icon el-icon-loading'],
      pswType: 'password',
      addFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '请用户名的长度在 3-10位', trigger: 'blur'}],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 12, message: '请密码的长度在 3-10位', trigger: 'blur'}],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}],
        mobile: [
          {required: true, message: '请输入手机', trigger: 'blur'},
          {validator: checkMoblie, trigger: 'blur'}]
      },
    }
  },
  methods: {
    addUser() {
      console.log(this.addForm);
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return this.$msg.error('失败')
        this.$msg.success('添加成功')
        this.$emit('addUser', this.addForm)
        this.$emit('update:dialogVisible', false)
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {
        });
    }
  },
  watch: {
    dialogVisible() {
      console.log(1);
      this.visible = this.dialogVisible
      // this.$refs.addFormRef.resetFields()
    },
    visible(){
      if(this.$refs.addFormRef) {
        this.$refs.addFormRef.resetFields()
      }
    },
    editForm(newVal, oldVal) {
      if (this.$refs.editFormRef) {
        this.$refs.editFormRef.resetFields()
      }
    }
  }
}
</script>

<style scoped>

</style>
