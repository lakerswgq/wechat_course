var proxyConfig = {
	"/api": {
		target: "http://localhost",
		changeOrigin: true,
		pathRewrite: {
			"^/api": "/api"
		}
	}
}

module.exports = proxyConfig;