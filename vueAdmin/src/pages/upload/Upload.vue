<template>
	<div class="uploadContainer">

		<el-dialog title="修改文件信息" v-model="fileDialogVisible">
		    <el-form :model="chosenFile" label-width="100px">
		    	<el-form-item label="文件key" >
		            <el-input v-model="chosenFile.key" disabled auto-complete="off" ></el-input>
		        </el-form-item>
		    	<el-form-item label="文件地址" >
		            <el-input v-model="chosenFile.url" auto-complete="off" ></el-input>
		        </el-form-item>
		        <el-form-item label="文件名称" >
		            <el-input v-model="chosenFile.name" auto-complete="off"></el-input>
		        </el-form-item>
		      	
		    </el-form>
		    <div slot="footer" class="dialog-footer">
		        <el-button @click="fileDialogVisible = false">取 消</el-button>
		        <el-button type="primary" @click="renameFile">确认修改</el-button>
		    </div>
		</el-dialog>



		<div>
			<h3>上传视频文件</h3>
			<el-upload
				style="width: 400px;"
				:data="form"
				:action="config.action"
				:name="config.name"
				:auto-upload="config.autoUpload"
				:file-list="config.videoList"
				ref="uploadVideo"
				:before-upload="beforeUpload"
				:on-preview="handleVideoPreview"
				:on-remove="handleRemoveVideo"
				:on-success="handleSuccessVideo"
				>
				<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
				<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('video')">上传到服务器</el-button>
				
			</el-upload>
		</div>

		<!-- cover upload -->
		<div>
			<h3>上传封面</h3>
			<el-upload
				class="avatar-uploader"
				:data="form"
				:action="config.action"
				:show-file-list="false"
				:on-success="handleCoverScucess"
				:before-upload="beforeUpload">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</div>

		<div>
			<h3>上传课件</h3>
			<el-upload
				style="width: 400px;"
				:data="form"
				:action="config.action"
				:name="config.name"
				ref="uploadDoc"
				:auto-upload="config.autoUpload"
				:file-list="config.docList"
				:before-upload="beforeUpload"
				:on-preview="handleDocPreview"
				:on-remove="handleRemoveDoc"
				:on-success="handleSuccessDoc"
				>
				<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
				<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('doc')">上传到服务器</el-button>
				
			</el-upload>
		</div>

		<div class="video_info">
			<h3>填写视频信息</h3>
			<el-form 
				ref="form"
				label-width="80px"
				label-position="top"
				style="margin:20px;width:60%;min-width:600px;"
				>

				<el-form-item label="视频标题">
					<el-input 
						:maxlength="20" 
						:minlength="3"
						size="large"
						placeholder="标题字数20字以内"
						v-model="title">
						
					</el-input>
				</el-form-item>

				<el-form-item label="视频简介">
					<el-input type="textarea" 
						:rows="8" 
						placeholder="视频详细信息"
						v-model="detail"></el-input>
				</el-form-item>

				<el-form-item label="视频分区">
					<el-radio-group v-model="section">
						<el-radio :label="0">分区1</el-radio>
						<el-radio :label="1">分区2</el-radio>
						<el-radio :label="2">分区3</el-radio>
						<el-radio :label="3">分区4</el-radio>
					</el-radio-group>
				</el-form-item>
				
				<el-form-item>
    				<el-button type="primary" @click="createCourse">提交视频信息</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>

	import Actions from "@http/course";

	console.log("actions:",Actions)

	let uploadConfig = {
		action: "http://up-z2.qiniu.com",
		headers: {
			"content-type": "multipart/form-data",
		},
		name: "file",
		autoUpload: false,
		videoList: [],
		docList: [],
	};

	export default {
		name: "upload_video",
		components: {

		},

		created: function () {
			this.setCourseId();
			this.getCourseInfo();
		},

		watch: {
			"$route": function (){
				this.resetCourse();
				console.log("router change");
				this.setCourseId();
				this.getCourseInfo();
			}
		},

		data (){
			return {
				config: uploadConfig,

				fileDialogVisible: false,
				chosenFile: {
					key: "",
					name: "",
					url: "",
				},

				title: "",
				detail: "",
				section: "",
				videos:[],
				docs: [],
				cover: null,

				form: {}, // 视频上传token等附加信息

				courseId: "",
				course: null,
				courseId: "",
				imageUrl: "", // 封面url

			}
		},
		methods: {
			handleError: function(error) {
				console.log("got a error:", error)
			},

			handleRes: function (res) {
				console.log("got server response:", res);
			},

			setCourseId: function (){
				let courseId = this.$route.params.courseId;
				console.log("course id:", courseId);
				this.courseId = courseId;
			},

			resetCourse: function (){
				this.courseId = "";
				this.title = "";
				this.detail = "";
				this.section = "";
				this.videos = [];
				this.docs = [];
				this.cover = null;
				this.imageUrl = "";
				this.config.videoList = [];
				this.config.docList = [];
			},

			getCourseInfo: function (){
				if (!this.courseId) {
					return;
				}
				Actions.getCourseById(this.courseId)
					.then(res => {
						console.log("course info:", res)
						let course = res.data.response;
						this.initCourse(course)
					})
					.catch(this.handleError)
			},

			initCourse: function (course) {
				this.title = course.title;
				this.detail = course.detail;
				this.section = course.section;

				this.config.videoList = this.videos = course.videos;
				this.config.docList = course.docs;

				this.cover = course.cover;
				this.imageUrl = this.cover.domain + "/" + this.cover.key;

			},

			updateCourseFile: function (updateType, courseId, type, file){
				// if (updateType === "append") {
				// 	Actions.appendCourseFile(courseId, type, file)
				// 		.then(this.handleRes)
				// 		.catch(this.handleError)
				// }
				// else if (updateType === "remove") {
				// 	Actions.removeCourseFile(courseId, type, file)
				// 		.then(this.handleRes)
				// 		.catch(this.handleError)
				// }
			},

			validate: function (){
				if (!this.title) {
					return "请填写标题"
				}
				else if (!this.detail){
					return "请填写详细信息"
				}
				else if (!this.section === "") {
					return "请选择分区"
				}
				else if (!this.videos.length){
					return "请上传至少一条视频"
				}
				else {
					return true;
				}
			},
			
			// get necessary info from qiniu's response 
			extractFileInfo: function (res){
				let fileInfo = {
					key:  res.key,
					bucket: res.bucket,
					url: res.domain + "/" + res.key,
					name: res.name.split(".")[0]
				};
				return fileInfo;
			},

			handleDocPreview: function (file){
				console.log("file:", file );
				let chosenFile = file.response || file;
				console.log("chosenFile:", chosenFile);
				if (!chosenFile.key){
					return
				};
				if (!chosenFile.url){
					this.docs.some((item) => {
						if (item.key === chosenFile.key){
							chosenFile = Object.assign({}, item);
						}
					})
				}
				this.chosenFile = {
					key: chosenFile.key,
					url: chosenFile.url,
					name: chosenFile.name,
					type: "doc",
				};
				this.fileDialogVisible = true;
			},
			handleVideoPreview: function (file){
				let chosenFile = file.response || file;
				console.log("chosenFile:", chosenFile);
				if (!chosenFile.key){
					return
				};
				if (!chosenFile.url){
					this.videos.some((item) => {
						if (item.key === chosenFile.key){
							chosenFile = Object.assign({}, item);
						}
					})
				}
				this.chosenFile = {
					key: chosenFile.key,
					url: chosenFile.url,
					name: chosenFile.name,
					type: "video",
				};
				this.fileDialogVisible = true;
			},
			renameFile: function (){
				let courseId = this.courseId,
					type = this.chosenFile.type,
					newUrl = this.chosenFile.url,
					key = this.chosenFile.key,
					newName = this.chosenFile.name.trim();

				if (!newName) {
					alert("请输入正确文件名");
					return;
				}
				else if(!newUrl){
					alert("请输入完整文件地址");
					return;
				}

				if (!courseId) { // when create a new course
					let array = (type === "video") ? this.videos : this.docs;
					array.some((item, index) => {
						if (item.key === key){
							item.name = newName;
							item.url = newUrl;
							return true;
						}
					})
					this.fileDialogVisible = false;
				}
				else { // modify existing course
					Actions.renameFile(courseId, type, key, newName, newUrl)
						.then(res => {
							console.log("rename:", res);
							this.getCourseInfo();
							this.$notify({
								title: '成功',
								message: '修改文件信息成功',
								type: 'success'
							});
							this.fileDialogVisible = false;
						})
						.catch(this.handleError)
				}
			},

			beforeUpload: function (file) {
				let self = this,
					fileName = file.name;

				console.log("file name:", fileName);

				return self.$http.post("/api/token", {
					key: fileName
				})
				.then(res => {
					self.form = {
						key: res.data.key,
						token: res.data.token
					};

					self.$nextTick(function (){
						
					})
				})
				.catch(this.handleError);
					
			},

			handleRemoveVideo: function (file, fileList) {
				let res = file.response || file;
				// this.$http.post("/api/delete", {
				// 	type: "video",
				// 	key: res.key
				// })
				Actions.removeFile({
					type: "video",
					key: res.key,
					courseId: this.courseId
				})
				.then(res => {
					console.log("delete response:", res);
					if (res.data.code === 1){

						this.videos = this.videos.filter(function(video) {
							return (video.key !== res.key)
						});

						alert("delete success");
					}
				})
				.catch(this.handleError);
			},

			handleSuccessVideo: function (res, file, fileList){
				console.log("video success");				
				console.log("server response:", res);

				let video = this.extractFileInfo(res);
				this.videos.push(video);

				console.log("fileList:", fileList);
				console.log("videos:", this.videos);

				if (this.courseId){
					Actions.appendCourseFile(this.courseId, "video", video);
					return;
				}

				// Actions.timeoutDelete(video);

				// console.log("fileList", fileList.length);
			},

			handleRemoveDoc: function (file, fileList){
				let res = file.response || file;
				Actions.removeFile({
					type: "doc",
					key: res.key,
					courseId: this.courseId
				})
				.then(res => {
					console.log("delete response:", res);
					if (res.data.code === 1){

						this.docs = this.docs.filter(function(doc) {
							return (doc.key !== res.key)
						});

						alert("delete success");
					}
				})
				.catch(this.handleError);
			},

			handleSuccessDoc: function(res, file, fileList){
				console.log("doc success", res);
				let doc = this.extractFileInfo(res);
				console.log("doc", doc);
				this.docs.push(doc);
				if (this.courseId){
					Actions.appendCourseFile(this.courseId, "doc", doc);
				}
				
			},

			handleCoverScucess: function (res, file) {
				// remove last cover image file 
				if (this.cover) {
					let coverKey = this.cover.key;
					Actions.removeFile({
						type: "cover",
						key: coverKey,
						courseId: this.courseId,
						cover: res
					})
					.then(res => console.log("cover image removed: ", res))
					.then(this.handleError)
				}
				this.imageUrl = URL.createObjectURL(file.raw);
				this.cover = res;
			},

			submitUpload(type) {
				console.log("form:", this.form);
				if (type === "video"){
					this.$refs.uploadVideo.submit();	
				}
				else if (type === "doc"){
					this.$refs.uploadDoc.submit();
				}
				
		    },

		    createCourse: function () {
		    	let self = this;
		    	let validated = this.validate();

		    	if (validated !== true){
		    		alert(validated)
		    		return;
		    	}

		    	if (this.courseId) {
		    		let basicInfo = {
		    			title: this.title,
		    			detail: this.detail,
		    			section: this.section
		    		};

		    		Actions.updateBasicInfo(this.courseId, basicInfo)
		    			.then(res => {
		    				this.$notify({
								title: '成功',
								message: '修改课程信息成功',
								type: 'success'
							});
		    			})
		    			.catch(this.handleError)

		    		return;
		    	}

		    	let course = {
		    		title: this.title,
		    		detail: this.detail,
		    		section: this.section,
		    		videos: this.videos,
		    		cover: this.cover,
		    		docs: this.docs
		    	};
		    	if (this.course){
		    		course = Object.assgn(this.course, course);
		    	}
		    	course.comments = course.comments || [];
		    	course.collections = course.collections || 0;

		    	console.log("course:", course);

				// return;

		    	// this.$http.post("/api/course/new", {
		    	// 	course: course
		    	// })
		    	Actions.createCourse(course)
			    	.then(res => {
			    		console.log("create new course:", res);
			    		// Actions.cancelTimeoutDelete(this.videos);
			    		this.courseId = res.data.course._id;
			    		this.$router.push({
			    			path: "/course/" + this.courseId
			    		});
			    		// this.cancelTimeoutDelete();
			    	})
			    	.catch(this.handleError);
		    }
		}
	}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 320px;
    height: 180px;
    line-height: 180px;
    text-align: center;
}

.avatar {
    width: 320px;
    height: 180px;
    display: block;
}
</style>



<style scoped>
.uploadContainer {
    margin-bottom: 50px;
    margin-left: 30px;
}


</style>
