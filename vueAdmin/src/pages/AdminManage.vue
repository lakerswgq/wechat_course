<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="setQuery">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button v-on:click="handleNew">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row 
			v-loading="listLoading" 
			@selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="username" label="用户名" width="120px" >
			</el-table-column>
			<el-table-column label="操作" >
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新建" v-model="newFormVisible" :close-on-click-modal="false">
			<el-form :model="newAdmin" label-width="80px" ref="newAdmin">
				<el-form-item label="用户名" prop="title">
					<el-input v-model="newAdmin.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码">
					<el-input type="password" v-model="newAdmin.password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码">
					<el-input type="password" v-model="newAdmin.checkPass"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="newFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="submitAdmin" :loading="newLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import NProgress from 'nprogress'
	import Admin from "@http/admin"
	

	export default {
		created (){
			this.getUsers();
		},
		watch: {
			"$route": function () {
				this.searchUser();
			},
		},
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: true,
				sels: [],//列表选中列

				newFormVisible: false,
				newLoading: false,
			
				//编辑界面数据
				newAdmin: {
					username: "",
					password: "",
					checkPass: "",
					
				},

			}
		},
		methods: {
			searchUser: function (){
				let username = this.$route.query.username;
				if (username) {
					this.getUsers(username);
				}
				else {
					this.getUsers();
				}
				
			},
			setQuery: function (){
				let username = this.filters.name;
				if (username) {
					username = username.trim();
					this.$router.push({
						path: "/admin_manage",
						query: {
							username: username
						}
					});
				}
				else {
					this.$router.push({
						path: "/admin_manage",
					});
				}
			},
			validate: function (){
				let username = this.newAdmin.username.trim(),
					password = this.newAdmin.password.trim(),
					checkPass = this.newAdmin.checkPass.trim();

				if (username && password && checkPass) {
					if (password !== checkPass) {
						return "两次输入的密码不匹配";
					}
					return true;
				}
				else {
					return "信息填写不全";
				}
			},
			resetAdmin: function () {
				this.newAdmin = {
					username: "",
					password: "",
					checkPass: "",
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				// this.getUsers();
			},
			//获取用户列表
			getUsers(name) {
				name = name || this.$route.query.name;
				this.listLoading = true;
				Admin.getUsers(name)
					.then(res => {
						this.listLoading = false;
						let users = res.data.response;
						console.log("users:", users);
						this.users = users;
					})
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除用户吗?', '提示', {
					type: 'warning'
				}).then(() => {
					// this.listLoading = true;
					NProgress.start();

					let id = row._id;
					console.log("id:", id);
					Admin.deleteAdmin(id)
						.then(res => {
							NProgress.done();
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							this.getUsers();							
						})
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleNew: function (index, row) {
				this.newFormVisible = true;
			},

			
			//新建
			submitAdmin: function () {
				let validateResult = this.validate(),
					editCourse = this.editForm;
				if (validateResult !== true){
					alert(validateResult);
					return;
				}
				
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.newLoading = true;
					NProgress.start();
					Admin.createAdmin({
						username: this.newAdmin.username.trim(),
						password: this.newAdmin.password.trim(),
					})
						.then(res => {
							console.log(res);
							if (res.data.code == 1){
								this.$notify({
									title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.resetAdmin();
								this.getUsers();	
							}
							else {
								this.$notify.error({
									title: '失败',
									message: res.data.error,
								});	
							}
							this.newLoading = false;
							NProgress.done();
							this.newFormVisible = false;
						})
						.catch(error => {
							this.$notify.error({
								title: '失败',
								message: error,
							});

							this.newLoading = false;
							NProgress.done();
							this.newFormVisible = false;
						})
				});
				
			},
			
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				let ids = this.sels.map(item => item._id);
				console.log("ids", ids);
				this.$confirm('确认删除选中用户吗？', '提示', {
					type: 'warning'
				}).then(() => {
					// this.listLoading = true;
					NProgress.start();
					Admin.deleteAdmin(ids)
						.then(res => {
							NProgress.done();	
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							this.getUsers();
						})
						.catch(error => console.log("error:", error))
				}).catch(() => {

				});
			}
		},
		
	}

</script>

<style scoped>

</style>