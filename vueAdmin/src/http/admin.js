import axios from "axios";


export default {
	createAdmin: function (admin) {
		return axios.post("/api/admin/new", {
			admin: admin
		});
	},

	deleteAdmin: function (adminId) {
		return axios.post("/api/admin/delete",{
			id: adminId
		})	
	},

	getAll: function () {
		return axios.get("/api/admin/all");
	},

	getUsers: function (username) {
		return axios.get("/api/admin/search", {
			params: {
				name: username
			}
		});
	},

	login: function (username, password) {
		return axios.post("/api/admin/login", {
			username: username,
			password: password
		});
	},
	signOut: function () {
		return axios.post("/api/admin/signout");
	},
	auth: function () {
		return axios.get("/api/admin/auth");
	}
}