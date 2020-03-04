<template>
<div class="login-wrapper">

    <el-form class="login-form" label-position="left" label-width="80px" :model="formData">
        <h3>用户登陆</h3>
        <el-form-item label="用户名">
            <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formData.password" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="onClickForLogin" :disabled="!formData.name||!formData.password">登陆</el-button>
        <el-alert
                style="margin-top: 10px"
                title="游客登陆账号：youke，密码：123456"
                type="info">
        </el-alert>
    </el-form>
</div>
</template>

<script>
    import {BASE_URL} from "../../global/util";

    export default {
        name: "login",
        data(){
            return{
                formData: {
                    name: '',
                    password: '',
                }
            }
        },
        methods:{
            async onClickForLogin(){
                let {status,data:{token,code,msg}} = await this.$http.post('/api/admin/login',this.formData)
                // console.log(res);
                if (status === 200){
                   if (code===0){
                       localStorage.setItem('myblogToken',token)

                       this.$router.push('/')
                   } else{
                       alert(msg)
                   }
                } else {
                    alert(msg)
                }
            }
        }
    }
</script>

<style scoped lang="scss">
.login-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ccc;
    /*align-items: center;*/
    .login-form{
        /*width: 400px;*/
        /*height: 400px;*/
        background-color: #fff;
        padding: 30px;
        box-sizing: border-box;

    }
}
</style>
