<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form label-width="80px" class="login_form" :model="LoginName" :rules="LoginFormRules"
               ref="reset">
        <el-form-item label="账户" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="LoginName.username" type="username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="LoginName.password"></el-input>
        </el-form-item>
      <el-form-item class="btn">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
      </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "login",
  data(){
    return{
      LoginName:{
        username:'admin',
        password:'123456'
      },
      LoginFormRules:{
        username: [
          {required:true,message:'请输入账号',trigger:'blur'},
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required:true,message:'请输入密码',trigger:'blur'},
          {min:6,max:12,message:'长度在6-12个字符',trigger:'blur'},
        ]
      }
    }
  },
  methods:{
    resetLoginForm(){
      this.$refs.reset.resetFields()
    },
    login(){
      this.$refs.reset.validate(async valid => {
        if (!valid) return;
        // const {data : res} = await axios.post('http://timemeetyou.com:8889/api/private/v1/login',this.LoginName)
        const {data:res} = await this.$http.post('login',this.LoginName)
        console.log(res);
        if (res.meta.status !== 200) return this.$msg.error('登录失败')
        this.$msg.success('登录成功')
        window.sessionStorage.setItem('token' , res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
  .login_box{
    width: 550px;
    height: 350px;
    background-color:beige;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 5px;
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 50%;
    border: solid 10px white;
    background-color: white;
    padding: 1px;
    box-shadow: 0px 0px 30px #eeeeee;
  }
  .avatar_box img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    /*border: solid 1px #eeeeee;*/
    background-color: #cccccc;
  }
  .btn{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    width: 100%;
    padding-left: 20px;
    padding-right: 50px;
    box-sizing: border-box;
    position: absolute;
    bottom: 20px;
  }
</style>
