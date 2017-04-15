var $file = $("#file"),
    $submit = $("#submit");
var formData = new FormData();

$file.change(function(event) {
    var file = this.files[0];
    formData.append("file", file);
});

$submit.click(function(event) {
    $.ajax({
            url: '/upload',
            type: 'post',
            dataType: 'json',
            data: formData,
            contentType: false,
            processData: false
        })
        .done(function(res) {
            console.log("res: ", res);
        })
        .fail(function(err) {
            console.log("error: ", err);
        })
        .always(function() {
            console.log("complete");
        });
});
