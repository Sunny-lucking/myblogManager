<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>文章管理</el-breadcrumb-item>
            <el-breadcrumb-item>文章列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--警告-->
        <el-alert
                style="margin-top: 20px"
                title="修改文章"
                type="success"
                center
                >
        </el-alert>

        <!--步骤条-->
        <el-steps :active="parseInt(activeIndex)" style="margin-top: 10px">
            <el-step title="文章标题" icon="el-icon-menu"></el-step>
            <el-step title="作者" icon="el-icon-user"></el-step>
            <el-step title="文章摘要" icon="el-icon-edit-outline"></el-step>
            <el-step title="标签" icon="el-icon-price-tag"></el-step>
            <el-step title="文章内容" icon="el-icon-edit"></el-step>
            <el-step title="提交修改" icon="el-icon-success
"></el-step>
        </el-steps>

        <!--标签页-->
        <el-form ref="form" :model="form" label-width="80px" style="margin-top: 30px">

            <el-tabs tab-position="left"   v-model="activeIndex">
                <el-tab-pane label="文章标题" name="1">
                    <el-form-item label="文章标题">
                        <el-input v-model="form.title"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="作者" name="2">
                    <el-form-item label="文章标题">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="文章摘要" name="3">
                    <el-form-item label="活动形式">
                        <el-input type="textarea" v-model="form.summary"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="标签" name="4">
                    <el-form-item>
                        <el-radio v-model="form.tag" :label="item.tagName" border v-for="(item,index) in tagsList" :key="index">{{item.tagName}}</el-radio>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="文章内容" name="5">
                    <quillEditor v-model="form.content"></quillEditor>
                </el-tab-pane>
                <el-tab-pane label="提交修改" name="6">
                    <el-button type="success" @click="onClickForEditArticle" :disabled="!$store.state.authList.includes('编辑文章')">提交修改</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>

    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";

    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    import { quillEditor } from 'vue-quill-editor'
    export default {
        name: "ArticleEdit",
        components: {
            quillEditor
        },
        data(){
            return {
                // 步骤条
                activeIndex:'1',

                // 表单
                form:{

                },
                tagsList:[]
            }
        },
        methods:{
            async onClickForEditArticle(){
                let {status,data:{article,code,msg}} = await this.$http.post('/api/article/editOneArticle',this.form)
                if (status === 200){
                    if (code===0){
                        this.$message({
                            message: '修改文章成功',
                            type: 'success'
                        });
                        this.$router.back();
                    } else {
                        alert(msg)
                    }
                }
                else{
                    alert('操作失败')
                }
            },
            async getAllTags(){
                let {status,data:{tags}} = await this.$http.get('/api/tag/getAllTags')
                this.tagsList = tags
            },
            async getCurrentArticle(){
                let {data:{article}} = await this.$http.get(`/api/article/getOneArticle?_id=${this.$route.query._id}`);
                this.form = article
            }
        },
        created(){
            this.getAllTags()
            this.getCurrentArticle()
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">

</style>
<style>
    .ql-editor{
        height: 500px;
    }
</style>
