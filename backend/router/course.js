let express = require("express");
let router = express.Router();
let CourseModel = require("../model/Course");
let _handle = require("./handle");

function handleSuccess (res, response){
	res.json({
		code: 1,
		message: "success",
		response: response
	});
}

function handleError (res, error){
	res.json({
		code: 0,
		message: "error",
		error: error
	});
}

router.post("/new", function (req, res) {
	let newCourse = req.body.course;

	console.log("new course:", newCourse);

	CourseModel.createCourse(newCourse)
		.then(course => {
			console.log("new Course:", course);
			res.json({
				code: 1,
				course: course,
				message: "create course success"
			})
		})
		.catch(error => {
			console.log("got error in create new course:", error);
			res.json({
				code: 0,
				message: "fail to create new course",
				error: error
			})
		})
});

router.get("/all", function (req, res) {
	CourseModel.getAllCourses()
		.then(result => {
			_handle.handleSuccess(res, result);
		})
		.catch(error => _handle.handleError(res, error));
})

router.post("/remove", function (req, res) {
	let ids = req.body.ids;
	if (!Array.isArray(ids)){
		ids = [ids];
	}
	CourseModel.removeCourses(ids)
		.then(response => {
			_handle.handleSuccess(res, response);
		}) 
		.catch(error => _handle.handleError(res, error));
});

router.get("/search", function (req, res) {
	let title = req.query.title;
	CourseModel.findByTitle(title)
		.then(courses => {
			_handle.handleSuccess(res, courses);
		})
		.catch(error => _handle.handleError(res, error));
})


// 已有课程新上传文件
router.post("/append_file", function (req, res){
	let body = req.body,
		courseId = body.courseId,
		type = body.type,
		file = body.file;

	CourseModel.appendFile(courseId, type, file)
		.then(handleSuccess)
		.catch(handleError);
})

// 已有课程删除文件

router.post("/remove_file", function (req, res){
	let body = req.body,
		courseId = body.courseId,
		type = body.type,
		key = body.key;

	CourseModel.removeFile(courseId, type, key)
		.then (handleSuccess)
		.catch(handleError)
})

router.post("/delete", function (req, res) {
	let courseId = req.body.courseId;
	CourseModel.deleteCourse(courseId)
})

router.post("/basic_info", function (req, res){
	let body = req.body,
		courseId = body.courseId,
		basicInfo = body.basicInfo;

	CourseModel.updateBasicInfo(courseId, basicInfo)
		.then(course => {
			_handle.handleSuccess(res, course);
		})
		.then(error => handleError(res, error))
})

router.post("/rename_file", function (req, res){
	let body = req.body,
		courseId = body.courseId,
		type =  body.type,
		key = body.key,
		newUrl = body.newUrl,
		newName = body.newName;

	CourseModel.renameFile(courseId, type, key, newName, newUrl)
		.then(result => {
			handleSuccess(res, result);
		})
		.catch(error => handleError(res, error));
})

router.post("/comment", function (req, res){
	let body = req.body,
	name = req.session.user.username,
	courseId = body.courseId,
	comment = body.comment;
	CourseModel.addComment(courseId, {
		name: name || "匿名",
		content: comment
	}).then(res => {
		console.log("post comment:", res);
		_handle.handleSuccess(res, res);
	}).catch(error => _handle.handleError(res, error))
})

router.get("/comment", function (req, res){
	let courseId = req.query.id;
	console.log("courseId:", courseId)
	CourseModel.getComment(courseId)
		.then(comments => {
			console.log("comments:", comments);
			_handle.handleSuccess(res, comments)
		})
		.catch(error => _handle.handleError(res, error))
})

router.get("/new", function (req, res){
	CourseModel.getNewCourse()
		.then(courses => {
			_handle.handleSuccess(res, courses);
		})
		.catch(error => _handle.handleError(res, error));
})

router.get("/hot", function (req, res){
	let num = req.query.num || 4;

	CourseModel.getHotCourse(num)
		.then(courses => {
			_handle.handleSuccess(res, courses)
		})
		.catch(error => {
			_handle.handleError(res, error)
		})
})


router.get("/most_comment", function (req, res){
	let num = req.query.num || 5;

	CourseModel.getMostCommentCourse(num)
		.then(courses => {
			courses = courses.sort(function (a, b){
				return b.comments.length - a.comments.length;
			}).slice(0, 0+num);

			_handle.handleSuccess(res, courses)
		})
		.catch(error => {
			_handle.handleError(res, error)
		})
})

router.get("/:id", function (req, res){
	let id = req.params.id;
	CourseModel.findById(id)
		.then(course => {
			_handle.handleSuccess(res, course);
			// res.json({
			// 	code: 1,
			// 	course: course,
			// 	message: "success find course"
			// });
		})
		.catch(error => {
			_handle.handleError(res, error);
			// res.json({
			// 	code: 0,
			// 	error: error,
			// 	message: "got error in find course"
			// });
		})
});

module.exports = router; 