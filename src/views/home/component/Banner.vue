<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
            <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--添加轮播图按钮-->
        <el-row style="margin-top: 20px">
            <el-col>
                <el-button type="success" @click="dialogFormVisible = true">添加轮播图</el-button>
            </el-col>
        </el-row>

        <!--表格-->
        <el-table
                :data="bannerList"
                height="450"
                style="width: 100%">
            <el-table-column
                    type="index"
                    prop="date"
                    label="#"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="bannerName"
                    label="轮播图名称">
            </el-table-column>
            <el-table-column
                    prop="url"
                    label="跳转链接">
            </el-table-column>
            <el-table-column
                    prop="imgUrl"
                    label="图片">
                <template slot-scope="scope">
                    <div style="height: 100px;position: relative;margin-top: 20px" class="image-wrapper">
                        <img :src="formUrl(scope.row.imgUrl)" alt="" style="width: 100%">
                        <!--<div class="mask">-->
                            <!--<i class="el-icon-upload"></i>-->
                        <!--</div>-->
                        <!--<input type="file" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;opacity: 0" class="input-image" @change="upLoadImage" ref="imageInput">-->

                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="manicate"
                    label="删除轮播图">
                <template slot-scope="scope">
                    <el-button type="danger"  @click="onClickForDeleteBanner(scope.row._id)" plain size="mini" icon="el-icon-delete" circle :disabled="!$store.state.authList.includes('删除轮播图')"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--添加轮播图对话框-->
        <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="轮播图名称" :label-width="formLabelWidth">
                    <el-input v-model="form.bannerName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" :label-width="formLabelWidth">
                    <el-input v-model="form.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图片" :label-width="formLabelWidth">
                    <div style="height: 100px;position: relative;cursor: pointer" class="image-wrapper">
                        <img :src="form.imgUrl" alt="" style="width: 100%;height: 100%;position: absolute;left: 0;top: 0;">
                        <div class="mask">
                            <i class="el-icon-upload"></i>
                        </div>
                        <input type="file" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;opacity: 0" class="input-image" @change="upLoadImage" ref="imageInput">
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickForAddAdmin" :disabled="!$store.state.authList.includes('添加轮播图')">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";

    export default {
        name: "Banner",
        data(){
            return {
                bannerList:[],

                // 添加轮播图
                dialogFormVisible:false,
                formLabelWidth: '120px',
                form: {
                    bannerName: '',
                    url:'',
                    imgUrl:require('./../../../assets/image.png'),
                },
                form_data:''
            }
        },
        methods:{
            onClickForDeleteBanner(_id){
                this.$confirm('此操作将永久删除该轮播图, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let {status,data:{code,msg}} = await this.$http.post(`/api/banner/deleteBanner`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: '删除轮播图成功',
                                type: 'success'
                            });
                            this.getAllBanners()
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
            formUrl(url){
              return `/${url}`
                // return 'http://localhost:5000/upload_ad3af0334b16d6ce4a43b15642644c3a.jpg'
            },
            async getAllBanners(){
               let {status,data:{msg,code,banners}} = await this.$http.get('/api/banner/getBanner')
                if (status===200){
                    if (code===0){
                        this.bannerList = banners;

                    }else {
                        alert(msg)
                    }
                }else {
                    alert("获取数据失败")
                }
            },
            async onClickForAddAdmin(){
                console.log(this.form_data);
                let {status,data:{msg,code}} = await this.$http.post('/api/banner/addBanner',this.form_data,{
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
                if (status===200){
                    if (code===0){
                        this.$message({
                            message: '添加轮播图成功',
                            type: 'success'
                        });

                    }else {
                        alert(msg)
                    }
                }else {
                    alert("获取数据失败")
                }
                this.getAllBanners();
                this.dialogFormVisible = false

            },
            upLoadImage(){
                let imageFile = this.$refs.imageInput.files[0]
                console.log(imageFile);
                let reader = new FileReader();
                reader.readAsDataURL(imageFile);
                let that = this
                reader.onload = function(e) {
                    that.form.imgUrl = e.target.result
                }

                this.form_data =new FormData();
                this.form_data.append('image',imageFile);
                this.form_data.append('bannerName',this.form.bannerName);
                this.form_data.append('url',this.form.url);
                console.log(this.form_data);

            },
        },
        created(){
            this.getAllBanners()
        }
    }
</script>

<style scoped lang="scss">
.mask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: 0;
    /*cursor: pointer;*/
    text-align: center;
    font-size: 60px;

    .el-icon-upload{
        line-height: 60px;
    }
}
.image-wrapper:hover .mask{
    opacity: 0.6;
}
</style>
