<template>
<!--  <div class="home-container">-->
    <el-container class="home-container">
      <el-header>
        <div>
        <img src="../assets/logo.png" alt="" style="width: 50px;height: 50px" @click="show3 = !show3">
        <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="clear">退出</el-button>
      </el-header>
      <el-container style="height: 100%">
<!--        <el-collapse-transition>-->
        <div class="aside-box">
        <el-aside width="200px" ref="aside">
<!--          <el-collapse-transition>-->
          <div class="lines" @click="change">|||</div>
<!--          </el-collapse-transition>-->
            <el-menu text-color="white" background-color="#333744" :collapse="isCollapse"
            :unique-opened="true" :router="true" :default-active="$route.path">
              <el-submenu :index="item.id + ''" v-for="(item,index) in homeList" :key="item.id">
                <template slot="title">
                  <i :class=pic[index]></i>
                  <span v-show="isShow">{{item.authName}}</span>
                </template>
                  <el-menu-item :index="'/' + itemGroup.path + ''"
                  v-for="itemGroup in item.children" :key="itemGroup.id"
                  >{{itemGroup.authName}}</el-menu-item>
              </el-submenu>
            </el-menu>
        </el-aside>
        </div>
        <el-main>
          <router-view></router-view>
        </el-main>
<!--        </el-collapse-transition>-->
      </el-container>
    </el-container>
<!--  </div>-->
</template>

<script>
export default {
  name: "home",
  data(){
    return {
      homeList:[],
      isShow:true,
      scrollWidth:'',
      pic:['el-icon-location','el-icon-menu','el-icon-document','el-icon-setting','el-icon-s-data'],
      show3:true,
      isCollapse:false
    }
  },
  created() {
    this.getHomeList()
  },
  methods:{
    clear(){
      window.sessionStorage.clear()
      this.$router.replace('/login')
    },
    async getHomeList(){
      const { data : res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$msg.error('res.meta.msg')
      this.homeList = res.data
      console.log(res);
    },
    change(){
      this.isShow = !this.isShow
      this.isCollapse = !this.isCollapse
      // setTimeout(() => {
        if (!this.isShow){
          this.$refs.aside.$el.style.cssText = 'width:68px'
        }else{
          this.$refs.aside.$el.style.cssText = 'width:200px'
        }
      // },100)

      // this.show3 = !this.show3
    }
  },
  watch:{

  }
}
</script>

<style scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  color: white;
  align-items: center;
}
.el-header div{
  display: flex;
  align-items: center;
}
.el-header div span{
  margin-left: 20px;
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color:#eaedf1 ;
}
.home-container{
  height: 100%;
}
.el-menu{
  /*color: white;*/
  border: 0;
}
.lines{
  background-color: #4A5064;
  color: white;
  padding-bottom: 3px;
  text-align: center;
}
.el-aside{
  font-size: 5px
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.aside-box >>> .collapse-transition {
  -webkit-transition: 0s height, 0s padding-top, 0s padding-bottom;
  transition: 0s height, 0s padding-top, 0s padding-bottom;
}

.aside-box >>> .horizontal-collapse-transition {
  -webkit-transition: 0s width, 0s padding-left, 0s padding-right;
  transition: 0s width, 0s padding-left, 0s padding-right;
}

.aside-box >>> .horizontal-collapse-transition .el-submenu__title .el-submenu__icon-arrow {
  -webkit-transition: 0s;
  transition: 0s;
  opacity: 0;
}
.aside-box{
  background-color:  #333744;
  height: 100%;
}
</style>
