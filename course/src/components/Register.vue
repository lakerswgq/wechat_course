<template>
    <div style="margin-top: 20px;">
        <mu-text-field hintText="用户名" v-model="username" type="text" icon="account_box" />
        <br>
        <mu-text-field hintText="密码" v-model="password" type="password" icon="https" />
        <br>
        <mu-text-field hintText="重复密码" v-model="checkPass" type="password" icon="https" />
        <br>
        <mu-raised-button @click="register" label="注册" backgroundColor="#a4c639" />
        <br>
		
        <mu-raised-button style="margin-top: 20px;" @click="jumpToLogin" label="去登录" labelPosition="after" secondary>
        </mu-raised-button>
    </div>
</template>



<script>
	import Actions from "@http"

	export default {
		created: function () {
			
		},
		data() {
			return {
				username: "",
				password: "",
				checkPass: "",
			}
		},
		methods: {
			validate: function () {
				let username = this.username.trim(),
					password = this.password.trim(),
					checkPass = this.checkPass.trim();

				if (username && password && checkPass){
					if (password === checkPass){
						return {
							username: username,
							password: password,
						}
					}
					else {
						return "两次输入密码不一致";
					}
				}
				else {
					return "信息填写不完整";
				}
			},

			register: function () {
				let result = this.validate();
				if (typeof result === "string"){
					alert(result);
					return;
				}
				else {
					Actions.register(result)
						.then(res => {
							console.log("res:", res);
							let code = res.data.code;
							if (code === 1){
								alert("register success");
								this.jumpToLogin();
							}
							else {
								return Promise.reject(res.data.error);
							}
						})
						.catch(error => {
							console.log("register error:", error)
							alert(error);
						});
				}
			},

			jumpToLogin: function () {
				this.$router.push({
					name: "Login"
				});	
			},


		}
	} 
</script>

<style>
	
</style>