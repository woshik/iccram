$(document).ready(function() {
    let timeOut
    $("#registrationForm").unbind("submit").bind("submit", function(e) {
        e.preventDefault()
        var form = $(this)
        var url = form.attr("action")
        var type = form.attr("method")
        var button = $("#buttonload")
        $("#message").fadeOut(0)
        $.ajax({
            url: url,
            type: type,
            headers: {
                'CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            data: form.serialize(),
            dataType: "json",
            beforeSend: function() {
                button.text("Account Creating...")
                    .append('<i class="fa fa-circle-o-notch fa-spin" style="margin-left: 7px;font-size: 17px;"></i>')
                    .attr("disabled", "disabled")
                    .css("cursor", "no-drop")
            },
            success: function(res) {
                button.removeAttr("disabled").css("cursor", "").text("Create Account").children().remove()
                if (res.success === true) {
                    window.location = res.message
                } else {
                    clearTimeout(timeOut)
                    $("#message").html('<div class="alert alert-warning alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                        res.message + "</div>").fadeIn(1000)
                    timeOut = setTimeout(function(){
                        $("#message").fadeOut(1000)
                    },5000)
                }
            }
        })
    })
})