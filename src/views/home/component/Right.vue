<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--表格-->
        <el-table
                :data="rightsTable"
                border
                height="400px"
                style="width: 100%;margin-top: 20px">
            <el-table-column
                    type="index"
                    label="#"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="authName"
                    label="权限名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="path"
                    label="路径">
            </el-table-column>
            <el-table-column
                    prop="level"
                    label="层级">
            </el-table-column>
            <el-table-column
                    prop="id"
                    label="id">
            </el-table-column>
            <el-table-column
                    prop="pId"
                    label="pId">
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";


    export default {
        name: "Right",
        data(){
            return{
                rightsTable:[]
            }
        },
        methods:{
            async getAllRights(){
                let {status,data:{rights}} = await this.$http.get('/api/right/getRight')
                this.rightsTable = rights

            }
        },
        mounted(){
                this.getAllRights();
        }
    }
</script>

<style scoped lang="scss">
    .box-card{
        background-color:rgba(244,251,251,0.47);
    }

</style>
<style>
    .el-breadcrumb__inner{
        color: black!important;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
        color: darkgreen!important;
    }
</style>
