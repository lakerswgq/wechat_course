module.exports = function (app) {
	app.use("/", require("./api"));
	app.use("/course",require("./course"));
	app.use("/view", require("./view"));
	app.use("/admin", require("./admin"));
}