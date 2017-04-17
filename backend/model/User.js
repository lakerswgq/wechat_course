let UserModel = require("../db").User

module.exports = {
	register: function (user) {
		return UserModel.create(user);
	},
	login: function (username, passowrd) {
		return UserModel.find({
			username: username,
			password: passowrd
		}).exec();
	},
	getUserById: function (id) {
		return CourseModel.findById(id).exec();
	},
	getCollections: function (id) {
		return UserModel.find({
			_id: id
		})
		.select({
			collections: 1
		})
		.exec();
	},
	findByName: function (username) {
		return UserModel.find({
			username: username
		}).exec();
	},
	collect: function (userId, courseId, cancelCollect) {
		if (cancelCollect === true) {
			return UserModel.update({ _id: userId }, {
				$pull: {
					collections: courseId
				}
			})
		}
		else {
			return UserModel.update( { _id: userId }, {
				$push : {
					collections: courseId
				}
			});
		}
	},
	
}