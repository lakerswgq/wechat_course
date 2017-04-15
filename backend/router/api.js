let express = require("express");
let router = express.Router();

let qiniu = require("../qiniu");
let CourseModel = require("../model/Course");

let timeoutTask = {};

function handleError (error){
	console.log("got a error:", error);
}

function handleRes (res){
	console.log("got response:", res);
}

router.post("/token", function (req, res) {
	let key = req.body.key;
	console.log("key:", key);

	try {
		res.json(qiniu.token(key));
	} catch(e) {
		console.log("token error", e);
	}	
	// res.send("fuck")
});

router.post("/timeout_delete", function (req, res){
	let file = req.body;
	let clear = setTimeout(function (){
		try {

			qiniu.remove(file.bucket, file.key)
				.then(res => console.log("timeout delete success:", res))
				.catch(error => console.log("timeout delete error:", error))

		} catch(e) {
			console.log(e);
		}
	}, 1000 * 60 * 5);

	let taskKey = file.bucket + "_" + file.key;

	timeoutTask.taskKey = clear;

	console.log("timeoutTask:", timeoutTask);
});

router.post("/cancel_timeout_delete", function (req, res) {
	let videos = req.body.videos;

	videos.forEach( function(video, index) {
		let taskKey = video.bucket + "_" + video.key;

		if (taskKey in timeoutTask){
			clearTimeout(timeoutTask[taskKey]);
			console.log("clear timeout tasks");
		}
	});
});

router.post("/cleartimeout",function (req, res){
	let videos = req.body.videos,
		cover = req.body.cover;

	if (videos && videos.length) {
		videos.forEach( function(item, index) {
			let taskKey = item.bucket + "_" + item.key;
			clearTimeout(timeoutTask[taskKey]);
		});
	}

	if (cover && cover.key){
		let taskKey = cover.bucket + "_" + cover.key;
		clearTimeout(timeoutTask[taskKey])
	}
});

router.post("/delete", function (req, res){
	let bucket = "video",
		courseId = req.body.courseId,
		type = req.body.type,
		key = req.body.key;

	// 删除数据库内数据
	if (courseId) {
		console.log("remove database data");
		if (type === "cover") {
			let newCover = req.body.cover;
			CourseModel.updateCover(courseId, newCover)
				.then(handleRes)
				.catch(handleError)
		}
		else {
			CourseModel.removeFile(courseId, type, key)
				.then(handleRes)
				.catch(handleError)
		}
	}

	try {
        qiniu.remove(bucket, key)
			.then(result => {
				res.json(result)
			})
			.catch(error => res.json(error));
		
	} catch(e) {
		console.log("catch error:", e);
	}
	
});



module.exports = router;