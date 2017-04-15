let express = require("express");
let router = express.Router();
let AdminModel = require("../model/Admin");
let _handle = require("./handle");
let sha1 = require("sha1");

router.get("/all", function (req, res) {
	AdminModel.getAll()
		.then(users => _handle.handleSuccess(res, users))	
		.catch(error => _handle.handleError(res, error));
})

router.get("/search", function (req, res){
	let username = req.query.name;
	AdminModel.searchByName(username)
		.then(users => {
			_handle.handleSuccess(res, users)
		})
		.catch(error => _handle.handleError(res, error));
})

router.post("/new", function (req, res){
	let admin = req.body.admin;
	AdminModel.getByName(admin.username)
		.then(users => {
			console.log(users);
			if (users.length == 0){
				return AdminModel.createAdmin(admin);
			}
			else {
				return Promise.reject("用户名已占用");
			}
		})
		.then((result) => {
			console.log("new admin");
			_handle.handleSuccess(res, result);
		})
		.catch((error) => _handle.handleError(res, error));
})

router.post("/login", function (req, res) {
	let body= req.body,
		username = body.username,
		password = body.password;
	console.log(username, password);
	AdminModel.login(username, password)
		.then(result => {
			if (result.length === 0){
				_handle.handleError(res, "用户名或密码不正确");
			}
			else {
				let user = result[0],
					session = {
					userId: user._id,
					username: user.username,
				};
				req.session.user = session;
				_handle.handleSuccess(res, "登录成功");
			}
		})
		.catch(error => _handle.handleError)
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

router.post("/delete", function (req, res) {
	let id = req.body.id;
	if (!Array.isArray(id)) {
		id = [id];
	}
	console.log(id);
	AdminModel.deleteAdmin(id)
		.then(result => {
			_handle.handleSuccess(res, result)
		})
		.catch(error => _handle.handleError(res, error));
})

router.get("/auth", function (req, res){
	let session = req.session;
	if (session.user){
		_handle.handleSuccess(res, "logined")
	}
	else {
		_handle.handleError(res, "not logined");
	}
})




module.exports = router;