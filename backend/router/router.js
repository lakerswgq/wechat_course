module.exports = function (app) {
	app.use("/api", require("./api"));
	app.use("/api/course",require("./course"));
	app.use("/", require("./view"));
	app.use("/api/admin", require("./admin"));
}