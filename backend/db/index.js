let mongoose = require("mongoose");

// Use native promises
mongoose.Promise = global.Promise;
// assert.equal(query.exec().constructor, global.Promise);

mongoose.connect("mongodb://localhost/test");

let db = mongoose.connection;

db.on("error", function (err){
	console.log("fail to connect mongodb:", err);
});

db.once("open", function () {
	console.log("connected to mongodb")
});

let CourseSchema = new mongoose.Schema({
	title: String,
	section: Number,
	detail: String,
	videos: Array,
	cover: Object,
	comments: Array,
	collections: Number,
	docs: Array,
},{
	collection: "courses"
});

let AdminSchema = new mongoose.Schema({
	username: String,
	password: String,
},{
	collection: "admin"
});

let UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	collections: Array,
}, {
	collection: "users",
});

let CourseModel = db.model("CourseModel", CourseSchema),
	AdminModel = db.model("AdminModel", AdminSchema)
	UserModel = db.model("UserModel", UserSchema);

module.exports = {
	Course: CourseModel,
	Admin: AdminModel,
	User: UserModel,
};