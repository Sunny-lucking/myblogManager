<template>
    <el-card class="box-card">
        <!--面包屑-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--搜索-->
        <el-row>
            <el-col>
                <el-input placeholder="请输入内容" v-model="keyWord" class="input-with-select" style="width: 300px;margin-top: 30px" clearable @clear="getAllAdmins">
                    <el-button slot="append" icon="el-icon-search" @click="onClickForGetAdminList"></el-button>
                </el-input>
                <el-button type="success" style="margin-left: 20px" @click="dialogFormVisible =true">添加用户</el-button>
            </el-col>
        </el-row>
        <!--表格-->
        <el-table
                :data="adminList"
                style="width: 100%">
            <el-table-column
                    type="index"
                    prop="date"
                    label="#"
                    width="50">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="电话">
            </el-table-column>
            <el-table-column
                    prop="create_time"
                    label="创建日期">
                <template slot-scope="scope">
                    {{scope.row.create_time | formatTime}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="state"
                    label="用户状态">
                <template slot-scope="scope">
                    <el-switch
                            v-model="scope.row.state"
                            active-color="#13ce66"
                            @change="onClickForChangeState(scope.row._id)"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    prop="manicate"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onClickForEditAdmin(scope.row._id)" plain size="mini" icon="el-icon-edit" circle></el-button>
                    <el-button type="success" @click="onClickForShowRoleDialog(scope.row._id)" plain size="mini" icon="el-icon-check" circle></el-button>
                    <el-button type="danger"  @click="onClickForDeleteAdmin(scope.row._id)" plain size="mini" icon="el-icon-delete" circle :disabled="!$store.state.authList.includes('删除管理员')"></el-button>
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

        <!--添加用户对话框-->
        <el-dialog title="添加管理员" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="form.phone" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickForAddAdmin" :disabled="!this.$store.state.authList.includes('添加管理员')">确 定</el-button>
            </div>
        </el-dialog>

        <!--编辑用户对话框-->
        <el-dialog title="编辑用户" :visible.sync="editFormVisible">
            <el-form :model="editForm">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="editForm.name" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="editForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="editForm.phone" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary"  @click="onClickForSendEdit" :disabled="!this.$store.state.authList.includes('编辑管理员')">确 定</el-button>
            </div>
        </el-dialog>

        <!--分配角色的对话框-->
        <el-dialog title="分配角色" :visible.sync="roleFormVisible">
            <el-form :model="roleForm">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="roleForm.name" autocomplete="off"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="分配角色" :label-width="formLabelWidth">
                    <el-select v-model="roleForm.currentId" placeholder="请选择角色">
                        <el-option label="请选择" :value="-1"></el-option>
                        <el-option  v-for="(item,index) in roles" :key="index" :label="item.roleName" :value="item.roleId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onClickForSetRole" :disabled="!this.$store.state.authList.includes('设置管理员角色')">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
    import {BASE_URL} from "../../../global/util";


    export default {
        name: "Users",
        data() {
            return {

                pageNum:1,
                pageSize:2,
                keyWord:'',
                adminList:[],
                count:0,
                // 添加用户对话框
                dialogFormVisible: false,
                form: {
                    name: '',
                    email:'',
                    phone:'',
                    password:''
                },
                formLabelWidth: '120px',
                //编辑用户对话框
                editFormVisible:false,
                editForm: {
                    name: '',
                    email:'',
                    phone:'',
                    password:''
                },

                // 分配角色对话框
                roleFormVisible: false,
                roleForm: {
                    name: '',
                    currentId:-1
                },
                roles:[],
                currentAdmin:{}
            }
        },
        methods:{
            async onClickForSetRole(){
                this.roleFormVisible = false
                let {status,data:{msg}} = await this.$http.post('/api/admin/setRole',{_id:this.currentAdmin._id,roleId:this.roleForm.currentId})
                if (status===200){
                    alert(msg)
                } else{
                    alert('操作失败')
                }

            },
            async getCurrentAdmin(_id){
                let {data:{admin}} = await this.$http.get(`/api/admin/getOneAdmin?_id=${_id}`);
                this.currentAdmin = admin
                this.roleForm.name = admin.name
                this.roleForm.currentId = admin.roleId

            },
            async getAllRoles(){
                let {data:{roles}} = await this.$http.get('/api/role/getRole')
                this.roles = roles
            },
            onClickForShowRoleDialog(_id){
                this.roleFormVisible = true
                this.getAllRoles();
                this.getCurrentAdmin(_id)
            },
            async onClickForChangeState(_id){
                let {status,data:{code,msg}} = await this.$http.post('/api/admin/changeAdminState',{_id})
                if (status===200){
                    if (code===0){
                        this.$message({
                            message: '修改状态成功',
                            type: 'success'
                        });
                    }else {
                        alert(msg)
                    }
                } else{
                    alert("操作失败")
                }
            },
            async onClickForSendEdit(){
                this.editFormVisible =false
                let {status,data:{msg,code}} = await this.$http.post(`/api/admin/editOneAdmin`,this.editForm)
                if (status===200){
                    if(code===0){
                        this.$message({
                            message: '修改管理员成功',
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
            async onClickForEditAdmin(_id){
                this.editFormVisible = true
                let {status,data:{admin,code,msg}} = await this.$http.get(`/api/admin/getOneAdmin?_id=${_id}`)
                if (status===200){
                    console.log(admin);
                    if (code===0){
                        console.log("该不会");
                        this.editForm = admin

                    }else {
                        console.log("不进来这里吗");
                        alert(msg)
                    }
                } else{
                    alert('操作失败，请检查网络问题')
                }
            },
            onClickForDeleteAdmin(_id){
                this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    let {status,data:{code,msg}} = await this.$http.post(`/api/admin/deleteAdmin`,{_id})
                    if(status===200){
                        if(code===0){
                            this.$message({
                                message: '删除管理员成功',
                                type: 'success'
                            });
                            this.getAllAdmins()
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
            async onClickForAddAdmin(){
                let {status,data:{code,msg,admin}} = await this.$http.post('/api/admin/addAdmin',this.form)
                if (status===200){
                    if (code===0){
                        this.$message({
                            message: '创建成功',
                            type: 'success'
                        });
                        this.getAllAdmins();
                        this.form={}
                        this.dialogFormVisible = false;
                    }else{
                        alert(msg)
                    }
                }else{
                    alert('操作失败')
                }
            },
            onClickForGetAdminList(){
                this.getAllAdmins()
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.pageSize = val;
                this.getAllAdmins()
            },
            handleCurrentChange(val) {
                // console.log(`当前页: ${val}`);
               this.pageNum = val;
               this.getAllAdmins();
            },
            async getAllAdmins(){
               let {status,data:{code,msg,adminList,count}} = await this.$http.get(`/api/admin/getAdmins?keyWord=${this.keyWord}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`)
               if (status===200){
                   if (code===0){
                       this.adminList = adminList;
                       this.count = count
                   }else {
                       alert(msg)
                   }
               }else {
                   alert("获取数据失败")
               }
           }
        },
        created(){
            this.getAllAdmins()
        },

    }
</script>

<style scoped lang="scss">

</style>
