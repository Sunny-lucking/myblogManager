<template>
    <el-container class="home">
        <el-header class="my-header">
            <el-row :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple"><img src="https://www.baidu.com/img/superlogo_c4d7df0a003d3db9b65e9ef0fe6da1ec.png?where=super" alt="" style="width: 100px;height: 50px"></div></el-col>
                <el-col :span="16"><div class="grid-content bg-purple" style="text-align: center;
line-height: 50px;font-size: 25px;color: white">培歌博客后台管理系统</div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple" style="text-align: center;line-height: 50px">
                    <el-dropdown>
                        <el-button  type="info">
                            {{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="onClickForSignOut">退出登陆</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div></el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="200px" class="my-aside">
                <el-menu
                        default-active="2"
                        :router="true"
                        class="el-menu-vertical-demo"
                        background-color="transparent"
                        text-color="#fff"
                        :unique-opened="true"
                        active-text-color="#ffd04b">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据监控</span>
                        </template>
                        <el-menu-item index="report" >
                            <i class="el-icon-location"></i>
                            <span>数据显示</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title" >
                            <i class="el-icon-location"></i>
                            <span>管理员管理</span>
                        </template>
                        <el-menu-item index="users" >
                            <i class="el-icon-location"></i>
                            <span>管理员列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title" >
                            <i class="el-icon-location"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item index="role" >
                            <i class="el-icon-location"></i>
                            <span>角色列表</span>
                        </el-menu-item>
                        <el-menu-item index="right" >
                            <i class="el-icon-location"></i>
                            <span>权限列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title" >
                            <i class="el-icon-location"></i>
                            <span>轮播图管理</span>
                        </template>
                        <el-menu-item index="banner" >
                            <i class="el-icon-location"></i>
                            <span>轮播图列表</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>文章管理</span>
                        </template>
                        <el-menu-item index="article">
                            <i class="el-icon-location"></i>
                            <span>文章列表</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
            <el-main class="my-main">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import jwt_decode from "jwt-decode";
    import {BASE_URL} from "../../global/util";

    export default {
  name: 'home',
    data(){
      return {
          authArr:[]
      }
    },
    methods:{
        getCheckArr(list){
            let tempArr = []
            list.forEach(tempItem1=>{
                if (tempItem1.is_enable===true)
                    tempArr.push(tempItem1.authName)
                tempItem1.children.forEach(tempItem2=>{
                    if (tempItem2.is_enable===true)
                        tempArr.push(tempItem2.authName)
                    tempItem2.children.forEach(tempItem3=>{
                        if (tempItem3.is_enable===true)
                            tempArr.push(tempItem3.authName)
                    })
                })
            })
            this.authArr = tempArr
            this.$store.commit('setAuthList', this.authArr);
        },
        async getSelfRole(){
            let {status,data:{role}} = await this.$http.get('/api/role/getSelfRole')
            this.getCheckArr(role.children)
            console.log(this.authArr);
        },
        onClickForSignOut(){
            console.log("哈哈");
            localStorage.removeItem('myblogToken')
            this.$router.push('/login')
        },

    },
    mounted(){
        this.getSelfRole()
    },
    computed:{
        user() {

            const token = localStorage.myblogToken;
            // 解析token
            const decode = jwt_decode(token);
            console.log(decode);
            return decode;
        }
    }
}
</script>

<style scoped lang="scss">
    .home{

        width: 100%;
        height: 100%;
    }
.my-header{
    /*background-color: #7f828b;*/
}
    .my-aside{
    }
    .my-main{
        /*background-color: beige;*/
    }
</style>
<style>
    .el-container{
        background-image: url("./../../assets/zhangnala.jpg");
        background-size: cover;
        background-attachment:fixed;
    }
</style>
