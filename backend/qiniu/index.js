var crypto = require('crypto');
var qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = "-FwuXvu0NnGzsGowH3y3s6kiXYucbMtkbwn2i_w9";

qiniu.conf.SECRET_KEY = "LAGQlV2jKc27YunCMDCkZCNp3_W4-i_WO4zRr1ch";

function createToken (key) {
	key = key || "";
	const bucket = "video";
	key = crypto.createHash('md5').update(((new Date()) * 1 + Math.floor(Math.random() * 10).toString())).digest('hex') + key;
	var policy = new qiniu.rs.PutPolicy(bucket+":"+key);
	policy.returnBody = JSON.stringify({
		key: "$(key)",
		bucket: "$(bucket)",
		domain: "http://omyf1h8pr.bkt.clouddn.com",
        name: "$(fname)"
	});
	var token = policy.token();
	return {
		key: key,
		token: token
	}
}


function remove(bucket, key) {

    return new Promise((reslove, reject) => {

        if (bucket && key) {
            var client = new qiniu.rs.Client();
            client.remove(bucket, key, function(err, res) {

                // fail to delete
                if (err) {
                    reject({
                        code: 0,
                        text: "got a error in remove process",
                        error: err
                    })
                }

                // success
                console.log("delete response:", res);
                reslove({
                    code: 1,
                    text: "delete successfully"
                })
            })
        }
        else {
            reject({
                code: 0,
                info: "invalid bucket or key"
            })
        }

    })
}


module.exports = {
	token: createToken,
	remove: remove
};



