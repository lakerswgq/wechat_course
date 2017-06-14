import axios from "axios";

// get method

function handleError(error) {
    console.log("error: ", error);
}

export default {
	createCourse: function (course) {
		return axios.post("/api/course/new", {
		    		course: course
		})
	},

    removeCourse: function (ids) {
        return axios.post("/api/course/remove", {
            ids: ids
        });
    },

    getAllCourses: function (){
        return axios.get("/api/course/all");
    },

    searchCourse: function (title) {
        return axios.get("/api/course/search", {
            params: {
                title: title
            }
        });
    },

    removeFile: function(fileInfo) {
        return axios.post("/api/delete", fileInfo);
    },

    timeoutDelete: function(data) {
        axios.post("/api/timeout_delete", data)
            .then(res => console.log("set timeout delete:", res))
            .catch(handleError)
    },
    cancelTimeoutDelete: function(files) {
        axios.post("/api/cancel_timeout_delete", {
                videos: files
            })
            .then(res => {
                console.log("cancel timeout task")
            })
            .catch(error => {
                console.log("got error in cancel timeout task:", error);
            })
    },

    getCourseById: function (id) {
        return axios.get("/api/course/"+id);
    },

    appendCourseFile: function (id, type, file) {
        return axios.post("/api/course/append_file", {
            courseId: id, 
            type: type,
            file: file
        });
    },

    removeCourseFile: function (id, type, key) {
        return axios.post("/api/course/remove_file", {
            courseId: id, 
            type: type,
            key: key
        })
    },

    updateBasicInfo: function (id, basicInfo) {
        return axios.post("/api/course/basic_info", {
            courseId: id,
            basicInfo: basicInfo
        });
    },

    renameFile: function (courseId, type, key, newName, newUrl){
        return axios.post("/api/course/rename_file", {
            courseId: courseId, 
            type: type, 
            key: key,
            newName: newName,
            newUrl: newUrl,
        });
    },

    getHotCourse: function (number = 5){
        return axios.get("/api/course/hot", {
            params: {
                num: number
            }
        });
    },

    getMostCommentCourse: function (number = 5){
        return axios.get("/api/course/most_comment", {
            params: {
                num: number
            }
        });
    }
}
