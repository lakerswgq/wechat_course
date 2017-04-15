<template>
    <section style="margin-top: 50px;max-width: 600px;">

        <el-form :model="newAdmin" label-width="100px">
        	<el-form-item label="用户名" >
                <el-input v-model="newAdmin.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" >
                <el-input type="password" v-model="newAdmin.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" >
                <el-input type="password" v-model="newAdmin.checkPass" auto-complete="off"></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitAdmin">提交</el-button>
            </el-form-item>
        </el-form>
    </section>
</template>


<script>
	import Admin from "@http/admin"
	export default {
		created (){

		},
		data (){
			return {
				newAdmin: {
					username: "",
					password: "",
					checkPass: "",
				},
			}
			
		},
		methods: {
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
			submitAdmin: function (argument) {
				let validateResult = this.validate();
				if (validateResult === true){
					let newAdmin = {
						username: this.newAdmin.username,
						password: this.newAdmin.password,
					};
					Admin.createAdmin(newAdmin)
						.then(res => console.log("admin created:", res))
						.catch(error => console.log("error:", error));
				}
			}
		}
	}
</script>

<style scpoed>
	.container {
		/*padding-top: 20px;*/
	}
</style>