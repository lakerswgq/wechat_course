var path = require("path");
var express = require("express");
var router = express.Router();

var rootDir = {
	root: path.join(__dirname, '../public')
} 

router.get("/admin/*", function (req, res) {
	res.sendFile('./admin.html', rootDir);
})
router.get("/wechat/*", function (req, res) {
	res.sendFile("./wechat.html", rootDir);
})


module.exports = router;