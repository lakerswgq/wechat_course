module.exports = {
    handleSuccess: function (res, response){
        res.json({
            code: 1,
            message: "success",
            response: response
        });
    },

    handleError: function (res, error){
        console.log("error:", error);
        res.json({
            code: 0,
            message: "error",
            error: error
        });
    }
}
