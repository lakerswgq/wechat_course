<template>
    <div style="margin-top: 20px;">
        <div>
            <mu-text-field hintText="用户名" v-model="username" type="text" icon="account_box" />
            <br>
            <mu-text-field hintText="密码" v-model="password" type="password" icon="https" />
            <br>
            <mu-raised-button @click="login" label="登录" backgroundColor="#195387" />
			
			<br>
            <mu-raised-button style="margin-top: 20px;" @click="jumpToRegister" label="去注册" labelPosition="after" secondary>
                
            </mu-raised-button>
        </div>
    </div>
</template>


<script>
import Actions from "@http"

export default {
	

	created: function () {
		
	},
	data (){
		return {
			username: "",
			password: "",
		}
	},
	methods: {
		validate: function () {
			let username = this.username.trim(),
				password = this.password.trim();

			if (username && password){
				return {
					username: username,
					password: password
				}
			}
			else {
				return "信息不完整";
			}
		},
		login: function () {
			let result = this.validate();

			if (typeof result === "string") {
				alert(result);
			}
			else {
				Actions.login(result)
					.then(res => {
						console.log("res:", res);
						let code = res.data.code;
						if (code == 1){
							//alert("登陆成功");
							this.$router.push({
								name: "Home"
							});
						}
						else {
							return Promise.reject(res.data.error);
						}
					})
					.catch(error => {
						console.log("login error:", error)
						alert(error);
					});
			}
		},
		jumpToRegister: function () {
			this.$router.push({
				name: "Register"
			})	
		},
	}
}
	
</script>

<style>
	
</style>

