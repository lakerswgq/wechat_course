import axios from "axios"

export default {

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