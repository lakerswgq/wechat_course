<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="setQuery">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="courses" highlight-current-row 
			v-loading="listLoading" 
			@selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="title" label="课程名称" width="200px" >
			</el-table-column>
			<el-table-column prop="detail" label="详细介绍" width="400px"  >
			</el-table-column>
			<el-table-column prop="collections" label="收藏数" width="100px" sortable>
			</el-table-column>
			<!-- <el-table-column prop="birth" label="生日" width="120" sortable>
			</el-table-column>
			<el-table-column prop="addr" label="地址" min-width="180" sortable>
			</el-table-column> -->
			<el-table-column label="操作" >
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					<el-button type="primary" size="small" @click="handleJump(scope.$index, scope.row)">课程详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="课程名称" prop="title">
					<el-input v-model="editForm.title" auto-complete="off"></el-input>
				</el-form-item>
				
				<el-form-item label="课程介绍">
					<el-input type="textarea" :rows="5" v-model="editForm.detail"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import NProgress from 'nprogress'
	import Course from "@http/course"
	

	export default {
		created (){
			this.getCourses();
		},
		watch: {
			"$route": function (){
				this.getCourses();
			},
		},
		data() {
			return {
				filters: {
					name: ''
				},
				courses: [],
				total: 0,
				page: 1,
				listLoading: true,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
			
				//编辑界面数据
				editForm: {
					id: "",
					title: "",
					detail: "",
					section: 0
				},

			}
		},
		methods: {
			setQuery: function (){
				let title = this.filters.name;
				if (title) {
					title = title.trim();
					this.$router.push({
						path: "/courses",
						query: {
							title: title
						}
					});
				}
				else {
					this.$router.push({
						path: "/courses"
					})
				}
			},
			validateEdit: function (){
				let editForm = this.editForm;
				if (editForm.title && editForm.detail){
					return true;
				}
				else {
					return "信息不完整";
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				// this.getUsers();
			},
			//获取用户列表
			getCourses(title) {
				title = title || this.$route.query.title || "";
				this.filters.name = title;
				this.listLoading = true;
				Course.searchCourse(title)
					.then(res => {
						this.listLoading = false;
						let courses = res.data.response;
						console.log("courses:", courses);
						this.courses = courses;
					})
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除课程吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					NProgress.start();
					let id = row._id;
					console.log("id:", id);
					Course.removeCourse(id)
						.then(res => {
							this.listLoading = false;
							NProgress.done();
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});	
							this.getCourses();
						})
						.catch(error => {

						})
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},

			handleJump: function (index, row) {
				let id = row._id;
				this.$router.push({
					path: "/course/" + id,
				});
			},
			
			//编辑
			editSubmit: function () {
				let validateResult = this.validateEdit(),
					editCourse = this.editForm;
				if (validateResult !== true){
					alert(validateResult);
					return;
				}
				
				this.$confirm('确认提交吗？', '提示', {}).then(() => {
					this.editLoading = true;
					NProgress.start();
					Course.updateBasicInfo(editCourse._id, editCourse)
						.then(res => {
							this.$notify({
								title: '成功',
								message: '提交成功',
								type: 'success'
							});	
							this.getCourses();
							this.editLoading = false;
							NProgress.done();
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
						})
						.catch(error => {
						
							this.$notify({
								title: '失败',
								message: error,
								type: 'error'
							});

							this.editLoading = false;
							NProgress.done();
							this.$refs['editForm'].resetFields();
							this.editFormVisible = false;
						})
				});
				
			},
			
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				let ids = this.sels.map(item => item._id);
				this.$confirm('确认删除选中课程吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					NProgress.start();

					Course.removeCourse(ids)
						.then(res => {
							this.listLoading = false;
							NProgress.done();
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success'
							});
							this.getCourses();
						})
						.catch(error => {

						})
					
				}).catch(() => {

				});
			}
		},
		
	}

</script>

<style scoped>

</style>