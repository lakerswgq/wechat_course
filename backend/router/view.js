var path = require("path");
var express = require("express");
var router = express.Router();

var rootDir = {
	root: path.join(__dirname, '../public')
} 

router.get("/", function (req, res) {
	res.sendFile('/admin/index.html', rootDir);
})

module.exports = router;