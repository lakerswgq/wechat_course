let express = require("express");
let router = express.Router();
let UserModel = require("../model/User");
let courseModel = require("../model/Course");
let _handle = require("./handle");

router.post("/login", function (req, res) {
	let body = req.body,
		username = body.username,
		password = body.password;

	UserModel.login(username, password)
		.then(result => {
			if (result.length > 0 ){
				let user = result[0],
					session = {
					userId: user._id,
					username: user.username,
				};
				req.session.user = session;
				_handle.handleSuccess(res, "login success");
			}
			else {
				return Promise.reject("用户名或密码错误");
			}
		})
		.catch(error => _handle.handleError(res, error));
})

router.post("/register", function (req, res) {
	let body = req.body,
		username = body.username,
		password = body.password;

	let newUser = {
		username: username,
		password: password,
		collections: []
	};

	UserModel.findByName(username)
		.then(users => {
			console.log(users);
			if (users.length == 0){
				return UserModel.register(newUser);
			}
			else {
				return Promise.reject("用户名已占用");
			}
		})
		.then((result) => {
			console.log("new user");
			_handle.handleSuccess(res, result);
		})
		.catch((error) => {
			console.log(error);
			_handle.handleError(res, error)
		});	
})

router.get("/auth", function (req, res){
	let session = req.session;
	console.log(session);
	if (session.user){
		let username = session.user.username;
		_handle.handleSuccess(res, {
			user: 1,
			username: username
		})
	}
	else {
		_handle.handleError(res, {
			user: null
		});
	}
})

router.post("/signout", function (req, res) {
	try {
		req.session.user = null;
		console.log("sign out");
		_handle.handleSuccess(res, "signout success");
	} catch(error) {
		// statements
		console.log(error);
		_handle.handleErrr(res, error);
	}
})

router.get("/if_collected", function (req, res) {
	let courseId = req.query.id;
	let userId = req.session.user.userId;
	if (userId) {
		UserModel.getCollections(userId)
			.then(result => {
				
				result = result[0];
				console.log("result:",result);
				let collections = result.collections;
				if (collections.indexOf(courseId) >= 0){
					_handle.handleSuccess(res, true);
				}
				else {
					_handle.handleSuccess(res, false);
				}
				
			})
			.catch(error => {
				_handle.handleError(res, error);
			})
	}
})

router.post("/collect", function (req, res) {
	let body = req.body,
		courseId = body.courseId,
		cancel = body.cancel;
	let userId = req.session.user.userId;
	console.log("userId:", userId);
	UserModel.collect(userId, courseId, cancel)
		.then(result => {
			console.log(result);
			
			let number = cancel ? -1 : 1;
			courseModel.collect(courseId, number)
				.then(courseResult => {
					console.log("course result:", courseResult);
				})
				.catch(error => {
					console.log("course error:", error);
				})

			_handle.handleSuccess(res, result);
		})
		.catch(error => {
			console.log(error);
			_handle.handleError(res, error);
		})

})

router.get("/collections", function (req, res) {
	let userId = req.session.user.userId;

	UserModel.getCollections(userId)
		.then(result => {
			result = result[0];
			let collections = result.collections;
			return courseModel.getCollectedCourse(collections);

		})
		.then(courses => {
			console.log(courses);
			_handle.handleSuccess(res, courses);
		})
		.catch(error => {
			console.log("error:", error);
			_handle.handleError(res, error);
		})
})





module.exports = router;