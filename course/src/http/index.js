import axios from "axios"

export default {

	// user api

	login: function (user) {
		let username = user.username,
			password = user.password;

		return axios.post("/api/user/login",{
			username: username,
			password: password
		});
	},
	register: function (user) {
		let username = user.username,
			password = user.password;		
		return axios.post("/api/user/register", {
			username: username,
			password: password
		});
	},
	auth: function () {
		return axios.get("/api/user/auth");
	},
	signout: function () {
		return axios.post("/api/user/signout");
	},
	ifCollected: function (courseId){
		return axios.get("/api/user/if_collected", {
			params: {
				id: courseId
			}
		});
	},
	collect: function (courseId, cancel) {
		return axios.post("/api/user/collect", {
			courseId: courseId,
			cancel: cancel
		});
	},
	getCollections: function () {
		return axios.get("/api/user/collections");
	},

	// course api

	searchByTitle: function (title) {
		return axios.get("/api/course/search", {
			params: {
				title: title
			}
		});
	},
	getCourseById: function (id) {
        return axios.get("/api/course/"+id);
    },
	collectCourse: function (courseId){

	},
	postComment: function (courseId, comment) {
		return axios.post("/api/course/comment", {
			courseId: courseId,
			comment: comment
		})
	},
	getComment: function (courseId) {
		return axios.get("/api/course/comment", {
			params: {
				id: courseId
			}
		});
	},
	getNewCourse: function (){
		return axios.get("/api/course/new");
	},
	getHotCourse: function (){
		return axios.get("/api/course/hot");
	}

}