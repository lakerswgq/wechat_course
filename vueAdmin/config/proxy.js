var proxyConfig = {
	"/api": {
		target: "http://localhost:3000",
		changeOrigin: true,
		pathRewrite: {
			"^/api": ""
		}
	}
}

module.exports = proxyConfig;