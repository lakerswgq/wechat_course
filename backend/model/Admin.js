let AdminModel = require("../db").Admin


module.exports = {
	getAll: function () {
		return AdminModel.find({}, "username").exec();
	},
	getByName: function (username) {
		return AdminModel.find({
			username: username
		},"username").exec();
	},
	searchByName: function (username) { // match name
		if (username) {
			return AdminModel.find({
				username: new RegExp(username, 'i'),
			}, "username").exec();	
		}
		else {
			return this.getAll();
		}
		
	},
	createAdmin: function (admin) {
		return AdminModel.create(admin);
	},
	login: function (username, passowrd) {
		return AdminModel.find({
			username: username,
			password: passowrd
		}).exec();
	},
	deleteAdmin: function (ids) {
		return AdminModel.remove({
			_id: {
				$in: ids
			}
		});
	}
}