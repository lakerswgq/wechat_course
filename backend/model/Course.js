let CourseModel = require("../db").Course
let qiniu = require("../qiniu");

module.exports = {
	handleError: function (error){
		console.log("got a error:", error);
	},
	createCourse: function (course) {
		return CourseModel.create(course);
	},
	removeCourses: function (ids) { // ids is an array
		return CourseModel.remove({
			_id: {
				$in: ids
			}
		});
	},

	getCollectedCourse: function (ids) {
		return CourseModel.find({
			_id: {
				$in: ids
			}
		})
		.select({
			title: 1,
			detail: 1,
			cover: 1,
			collections: 1,
			comments: 1,
			section: 1,
		});
	},

	getAllCourses: function () {
		return CourseModel.find().select({
			title: 1,
			detail: 1,
			cover: 1,
			collections: 1,
			comments: 1,
			section: 1,
		}).exec();
	},

	findByTitle: function (title){
		if (title) {
			return CourseModel.find({
				title: new RegExp(title, 'i'),
			}).select({
				title: 1,
				detail: 1,
				cover: 1,
				collections: 1,
				comments: 1,
				sections: 1,
			}).exec();	
		}
		else {
			return this.getAllCourses();
		}
		
	},
	findById: function (id) {
		return CourseModel.findById(id).exec();
	},
	getAllComments: function (id) {
		
	},
	deleteCourse: function (id) {
		CourseModel.remove({
			_id: id
		})
	},
	updateBasicInfo: function (id ,courseInfo) {
		return CourseModel.update({ _id: id }, {
			$set: {
				title: courseInfo.title,
				detail: courseInfo.detail,
				section: courseInfo.section,
			}
		}).exec();
	},
	updateCover: function (id, cover){
		cover = cover || null;
		return CourseModel.update( { _id: id }, {
			$set: {
				cover: cover
			}
		}).exec();
	},
	appendFile: function (id, type, file) {
		if (type === "cover"){
			return this.updateCover(id, file);
		}
		else if(type === "video" || type === "doc") {
			let arrayName = (type === "video") ? "videos" : "docs";

			return CourseModel.update( { _id : id }, {
				$push: {
					[arrayName]: file
				}
			})	
		}
	},
	removeFile: function (id, type, fileKey){
		let arrayName = (type === "video") ? "videos" : "docs";
		console.log(arrayName);
		console.log(fileKey);
		return CourseModel.update( { _id: id }, {
			$pull : {
				[arrayName]: {
					key: fileKey
				}
			}
		}).exec();
	},
	renameFile: function (id, type, fileKey, newName, newUrl){
		if (type === "video") {
			return CourseModel.update({
				_id: id,
				"videos.key": fileKey
			}, {
				$set: {
					"videos.$.name": newName,
					"videos.$.url": newUrl,
				}
			}).exec();	
		}
		else if (type === "doc") {
			return CourseModel.update({
					_id: id,
					"docs.key": fileKey
				}, {
					$set: {
						"docs.$.name": newName,
						"docs.$.url": newUrl,
					}
				}).exec();		
		}	
	},

	// wechat methods

	addComment: function (courseId, comment){
		return CourseModel.update( { _id : courseId }, {
				$push: {
					comments: comment
				}
		})
	},

	getComment: function (courseId){
		return CourseModel.findById(courseId).select({
			comments: 1
		})
		.sort({
			created_at: 1
		})
		.exec();
	},

	collect: function (courseId, number){
		return CourseModel.update({ _id: courseId }, {
			$inc: {
				collections: number
			}
		});
	},

	getHotCourse: function (number = 4){
		number = Number(number);

		return CourseModel.find()
		.select({
			title: 1,
			detail: 1,
			cover: 1,
			collections: 1,
			comments: 1,
			sections: 1,
		})
		.sort({
			collections: -1
		})
		.limit(number)
		.exec();
	},
	getNewCourse: function (){
		let number = 4;
		return CourseModel.find()
		.select({
			title: 1,
			detail: 1,
			cover: 1,
			collections: 1,
			comments: 1,
			sections: 1,
		})
		.sort({
			_id: -1
		})
		.limit(number)
		.exec();
	},

	getMostCommentCourse: function (number = 5){
		number = Number(number);

		return CourseModel.find()
		.select({
			title: 1,
			detail: 1,
			cover: 1,
			collections: 1,
			comments: 1,
		})
		.exec();
	}
	// modifyCollections: function (courseId, number) {
	// 	return CourseModel.update({ _id: courseId }, {

	// 	})
	// }

};