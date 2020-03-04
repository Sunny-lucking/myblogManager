<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>文章管理</el-breadcrumb-item>
            <el-breadcrumb-item>文章列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索-->
        <el-row>
            <el-col>
                <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select" style="width: 300px;margin-top: 30px" clearable @clear="getAllArticle">
                    <el-button slot="append" icon="el-icon-search" @click="onClickForGetArticles"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <!--表格-->
        <el-table
                :data="articleList"
                style="width: 100%">
            <el-table-column
                    type="index"
                    prop="date"
                    label="#"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="标题"
                    width="360">
            </el-table-column>
            <el-table-column
                    prop="username"
                    label="作者">
            </el-table-column>
            <el-table-column
                    prop="summary"
                    label="摘要">
            </el-table-column>
            <el-table-column
                    prop="tag"
                    label="标签">
            </el-table-column>
            <el-table-column
                    prop="manicate"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onClickForEditArticle(scope.row._id)" plain size="mini">编辑</el-button>
                    <el-button type="danger"  @click="onClickForDeleteArticle(scope.row._id)" plain size="mini" :disabled="!$store.state.authList.includes('删除文章')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--分页-->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[2, 4, 6, 8]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="count">
        </el-pagination>


    </el-card>
</template>

<script>

    import {BASE_URL} from "../../../global/util";

    export default {
        name: "Article",
        data(){
            return {
                // 搜索框
                keyWord:'',

                // 表格信息
                articleList:[],
                // 分页
                pageNum:1,
                pageSize:8,
                count:0,
            }
        },
        methods:{
            async onClickForEditArticle(_id){
                this.$router.push({name:'articleedit',query:{_id:_id}})
            },
            onClickForDeleteArticle(_id){
                this.$confirm('永久删除文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let {status,data:{code,msg}} = await this.$http.post(`/api/article/deleteArticle`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: '删除文章成功',
                                type: 'success'
                            });
                            this.getAllArticle()
                        }else{
                            alert(msg)
                        }
                    }else{
                        alert("操作失败")
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });


            },
            onClickForGetArticles(){
                this.getAllArticle()
            },
            async getAllArticle(){
                let {status,data:{code,msg,articleList,count}} = await this.$http.get(`/api/article/getArticle?keyWord=${this.keyWord}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`)
                if (status===200){
                    if (code===0){
                        this.articleList = articleList;
                        this.count = count
                    }else {
                        alert(msg)
                    }
                }else {
                    alert("获取数据失败")
                }
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getAllArticle()
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
                this.pageNum = val;
                this.getAllArticle();
            },
        },
        created(){
            this.getAllArticle();
        },

    }
</script>

<style scoped lang="scss">

    .box-card{
        background-color:rgba(244,251,251,0.47);
    }

    .el-breadcrumb__inner{
        color: black!important;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
        color: darkgreen!important;
    }
</style>
