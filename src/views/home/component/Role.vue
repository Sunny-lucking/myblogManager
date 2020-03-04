<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/" >
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--添加角色按钮-->
        <el-row style="margin-top: 20px">
            <el-col>
                <el-button type="success" @click="dialogFormVisible = true">添加角色</el-button>
            </el-col>
        </el-row>

        <!--表格-->
        <el-table
                :data="rolesTable"
                style="width: 100%">
            <el-table-column
                    type="expand"
                    label="#"
                    width="50">
                <template slot-scope="scope">
                    <el-row v-for="(item1,index) in scope.row.children" :key="index" v-if="item1.is_enable">
                        <el-col :span="4">
                            <el-tag type="success" closable >{{item1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row v-for="(item2,index) in item1.children" :key="index" v-if="item2.is_enable">
                                <el-col :span="4">
                                    <el-tag closable>
                                        {{item2.authName}}
                                    </el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="20" >
                                    <el-tag type="warning" v-for="(item3,index) in item2.children" :key="index" closable v-if="item3.is_enable">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <span v-if="scope.row.children.length===0">未分配权限</span>
                </template>
            </el-table-column>
            <el-table-column
                    type="index"
                    prop="date"
                    label="#"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="roleName"
                    label="角色名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="roleDesc"
                    label="角色描述">
            </el-table-column>
            <el-table-column
                    prop="manicate"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onClickForEditAdmin(scope.row._id)" plain size="mini" icon="el-icon-edit" circle></el-button>
                    <el-button type="success" @click="onClickForShowRightDialog(scope.row._id)" plain size="mini" icon="el-icon-check" circle></el-button>
                    <el-button type="danger"  @click="onClickForDeleteRole(scope.row._id)" plain size="mini" icon="el-icon-delete" circle :disabled="!$store.state.authList.includes('删除角色')"></el-button>
                </template>
            </el-table-column>
        </el-table>


        <!--添加角色对话框-->
        <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="form.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色ID" :label-width="formLabelWidth">
                    <el-input v-model="form.roleId" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickForAddRole" :disabled="!this.$store.state.authList.includes('添加角色')">确 定</el-button>
            </div>
        </el-dialog>

        <!--修改权限的对话框-->
        <el-dialog title="修改权限" :visible.sync="setRightFormVisible">
            <el-tree
                    ref="tree"
                    :data="treeList"
                    show-checkbox
                    node-key="id"
                    default-expand-all
                    :default-checked-keys="checkArr"
                    :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setRightFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRoleRight" :disabled="!$store.state.authList.includes('修改角色权限')">确 定</el-button>
            </div>
        </el-dialog>

        <!--编辑角色对话框-->
        <el-dialog title="编辑角色" :visible.sync="editFormVisible">
            <el-form :model="editForm">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="editForm.roleName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="editForm.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色Id" :label-width="formLabelWidth">
                    <el-input v-model="editForm.roleId" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary"  @click="onClickForSendEdit" :disabled="!$store.state.authList.includes('编辑角色')">确 定</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";


    export default {
        name: "Role",
        data(){
            return{
                rolesTable:[],
                // 添加用户对话框
                dialogFormVisible: false,
                formLabelWidth: '120px',
                form: {
                    roleName: '',
                    roleDesc:'',
                    roleId:'',
                },

                // 修改权限对话框
                setRightFormVisible:false,
                currentRoleId:'',
                treeList:[],
                checkArr:[],
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                // 编辑角色对话框
                editFormVisible:false,
                editForm: {
                    roleName: '',
                    roleDesc:'',
                    roleId:'',
                },
            }

        },
        methods:{
            async onClickForEditAdmin(_id){
                this.editFormVisible = true
                let {status,data:{role,code,msg}} = await this.$http.get(`/api/role/getOneRole?_id=${_id}`)
                if (status===200){
                    console.log(role);
                    if (code===0){
                        console.log("该不会");
                        this.editForm = role

                    }else {
                        console.log("不进来这里吗");
                        alert(msg)
                    }
                } else{
                    alert('操作失败，请检查网络问题')
                }
            },
            async onClickForSendEdit(){
                let {status,data:{code,msg}}  = await this.$http.post('/api/role/editOneRole',this.editForm)
                this.editFormVisible =false
                if (status===200){
                    if(code===0){
                        this.$message({
                            message: '修改角色成功',
                            type: 'success'
                        });
                        this.getAllAdmins()
                    }else {
                        alert(msg)
                    }
                }else{
                    alert('操作失败')
                }
            },
            onClickForDeleteRole(_id){
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let {status,data:{code,msg}} = await this.$http.post(`/api/role/deleteRole`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: '删除管角色成功',
                                type: 'success'
                            });
                            this.getAllRoles()
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
            async setRoleRight(){
                let arr1 = this.$refs.tree.getHalfCheckedKeys()
                let arr2 = this.$refs.tree.getCheckedKeys();
                console.log(arr1);
                console.log(arr2);
                let arr = [...arr1,...arr2]
                // console.log(arr);
                let tempTreeList = this.treeList;
                tempTreeList.forEach(tempItem1=>{
                    if (arr.includes(tempItem1.id)) {
                        tempItem1.is_enable = true
                    }else{
                        tempItem1.is_enable = false
                    }
                    tempItem1.children.forEach(tempItem2=>{
                        if (arr.includes(tempItem2.id)) {
                            tempItem2.is_enable = true
                        }else{
                            tempItem2.is_enable = false
                        }
                        tempItem2.children.forEach(tempItem3=>{
                            if (arr.includes(tempItem3.id)) {
                                tempItem3.is_enable = true
                            }else{
                                tempItem3.is_enable = false
                            }
                        })
                    })
                })

                // console.log(tempTreeList);
                let {status,data:{code,msg}} = await this.$http.post('/api/role/setRoleRight',{children:tempTreeList,_id:this.currentRoId})
               if (status===200){
                   if (code===0){
                       this.$message({
                           message: '修改权限成功',
                           type: 'success'
                       });
                   }
                   else {
                       alert(msg)
                   }
               } else{
                   alert('操作失败')
               }
               this.setRightFormVisible = false
                this.getAllRoles()
            },
            //获取权限对话框中的选定选项

            getCheckArr(list){
                let tempArr = []
                list.forEach(tempItem1=>{
                    tempItem1.children.forEach(tempItem2=>{
                        tempItem2.children.forEach(tempItem3=>{
                            if (tempItem3.is_enable===true)
                            tempArr.push(tempItem3.id)
                        })
                    })
                })
                this.checkArr = tempArr
            },
            async getCurrentRoleRight(_id){
                this.currentRoId = _id
                // let res = await this.$http.get('/api/role/getOneRole?_id='+_id)
                let {status,data:{msg,code,role}} = await this.$http.get('/api/role/getOneRole?_id='+_id)
                console.log(role);
                this.treeList = role.children
                this.getCheckArr(this.treeList)

            },
            onClickForShowRightDialog(_id){
                this.getCurrentRoleRight(_id)
                this.setRightFormVisible = true
            },
            async onClickForAddRole(){
                let {status,data:{code,msg,role}} = await this.$http.post('/api/role/addRole',this.form)
                if (status===200){
                    if (code===0){
                        this.$message({
                            message: '创建成功',
                            type: 'success'
                        });
                        this.getAllRoles();
                        this.form={}
                        this.dialogFormVisible = false;
                    }else{
                        alert(msg)
                    }
                }else{
                    alert('操作失败')
                }
            },
            async getAllRoles(){
                let {status,data:{roles}} = await this.$http.get('/api/role/getRole')
                this.rolesTable = roles
            }
        },
        created(){
            this.getAllRoles();
        }
    }
</script>

<style scoped lang="scss">

</style>
<style>
    .el-breadcrumb__inner{
        color: black!important;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover{
        color: darkgreen!important;
    }
</style>
